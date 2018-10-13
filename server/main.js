import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { user_details } from './../import/collections/insert.js';
import { task_assignment } from './../import/collections/insert.js';
import {  notification   } from  './../import/collections/insert.js';
import { IronRouter } from 'meteor/iron:router';
import { Session } from 'meteor/session';
import { task_list } from './../import/collections/insert.js';
// import { MongoClient } from 'mongodb';
// import { MongoCron } from 'mongodb-cron';
// import { cron_jobs_reminder } from './../import/collections/insert.js';
if (Meteor.isServer) {
  SyncedCron.add({
  name: 'Crunch some important numbers for the marketing department',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 30 seconds');
  },
  job: function() {
  	var result = task_list.find({}).fetch();
  	var curr_date = new Date().getTime();
	for(var i=0 ; i < result.length ; i++ ){
		var due_date_result = result[i].due_date;
		console.log(due_date_result);
		var due_date_result_1 = new Date(due_date_result);
		var days_remaining = due_date_result_1.getTime() - curr_date;
		var oneDay = 24*60*60*1000; 
		var curr_date = new Date();
		var numberOfDaysToAdd = 8;
		var date_show = curr_date.setDate(curr_date.getDate() + numberOfDaysToAdd); 
		var curr_date_format = moment(date_show).format('MMM DD, YYYY');
		console.log(curr_date_format);
		var days_difference = Math.round(Math.abs(days_remaining/oneDay));
		if( curr_date_format == due_date_result ){
			var cron_store_to_db = task_list.find({ 'due_date' : curr_date_format }).fetch();
			for(var j=0 ; j < cron_store_to_db.length ; j++){
				var task_list_update = task_list.update({ _id : cron_store_to_db[j]._id },{ $set : {"reminder_notification_sent" : 1}});
				console.log(task_list_update);
			}
			// console.log(cron_store_to_db);
		}
		else {
			var cron_store_to_db_false = task_list.update({ 'due_date' : curr_date_format },{ $set : {"reminder_notification_sent" : 0}});
			console.log(cron_store_to_db_false);
		}
	} 
	return 'hello';
  }
  
});
  SyncedCron.start();
 SyncedCron.config({
    // Log job run details to console
    log: true,

    // Use a custom logger function (defaults to Meteor's logging package)
    logger: null,

    // Name of collection to use for synchronisation and logging
    collectionName: 'cronHistory',

    // Default to using localTime
    utc: false,

    /*
      TTL in seconds for history records in collection to expire
      NOTE: Unset to remove expiry but ensure you remove the index from
      mongo by hand

      ALSO: SyncedCron can't use the `_ensureIndex` command to modify
      the TTL index. The best way to modify the default value of
      `collectionTTL` is to remove the index by hand (in the mongo shell
      run `db.cronHistory.dropIndex({startedAt: 1})`) and re-run your
      project. SyncedCron will recreate the index with the updated TTL.
    */
   
  }); 
//     var task = cron.schedule('1-5 * * * *', () => {
//     alert('running every min');
// });
  
}
Meteor.publish("fetch_user_details",function(user_id){
	 return user_details.find({"user_id" :  user_id })
});
Meteor.publish("fetch_task_list",function(user_id){
	 return task_list.find({
      'user_id'     : user_id,
      'task_status' : true,
    },{sort: {created_at: -1}});
});
Meteor.publish("fetch_assigned_task_to",function(user_id){
	 return  task_assignment.find({"assigned_by" : user_id},{sort: {created_at: -1}}); 
});
Meteor.publish("fetch_assigned_task_by",function(user_id){
	 return task_assignment.find({
      'assigned_to'             : user_id,
      'task_completion_status'  : false,
        },{sort: {created_at: -1}});
});
Meteor.publish("assigned_by_user_name",function(user_by){
	return user_details.find({'user_id' : user_by});
});
Meteor.publish("assigned_to_user_name",function(user_to){
	return user_details.find({"user_id" : user_to });
});
Meteor.publish("task_completed",function(task_id){
	var result = task_list.find({_id : task_id});
	return result;
});
Meteor.publish("assigned_task_completed",function(task_id){
	var result = task_assignment.find({_id : task_id});
	return result;
});
Meteor.publish("notification",function(notification_username){
	return user_details.find({'user_id' : notification_username});
});
Meteor.publish("user_task_completed",function(assigned_to_id){
	var notification_assigned_to = notification.find({'notification_to' : assigned_to_id });
	return notification_assigned_to;
});
Meteor.publish("user_task_completed",function(user_id){
	 var date = task_list.find({'user-id' : user_id});
	return date;
});
Meteor.publish('format_date',function(user_id){
	var date = task_list.find({'user-id' : user_id});
	return date;
});
Meteor.publish('fetch_task_start_end_time',function(task_id){
	return task_list.find({_id : task_id});
});
Meteor.publish('task_reminder',function(user_id){
	return notification.find({'notification_by' : user_id});
});
Meteor.methods({

	user_signup:function(username,mail,password){
		  var mailfind = user_details.find({'email' : mail }).count();
		  if(mailfind>0){
		  	return "email_already_exists";
		  }
		  var user_id  = "user_"+Math.floor(1000 + Math.random() * 9000)+new Date().getTime();
		  var name1 = user_details.insert({
						    user_id          : user_id,
						    user_name        : username,
						    user_email       : mail,
						    user_password    : password,
						    created_at       : Date.now(),
						    status           : true,
						  });
		  return user_id;
	},
	user_login:function(loguser,logpassword){
		var result = user_details.find({
      "user_email" : loguser,
      "user_password"  : logpassword,
    }).fetch();	
    return result;	
	},
	task_list:function(task_title,user_id,start_date,due_date){
		console.log("start_date")
		console.log(start_date)
		var listItems = task_list.insert({
      task_title    : task_title,
      user_id       : user_id,
      task_id       : "task_"+Math.floor(1000 + Math.random() * 9000)+new Date().getTime(),
      created_at    : Date.now(),
      start_date    : start_date,
      due_date      : due_date,
      task_status   : true,
    });
		return true;	
	},
	task_assignment_notification:function(user_id,assigned_to,task_title,task_discription,task_start_date,task_end_date){
		task_assignment.insert({
        task_id                       : "task_"+Math.floor(1000 + Math.random() * 9000)+new Date().getTime(),
        assigned_by                   : user_id,
        assigned_to                   : assigned_to,
        task_title                    : task_title,
        task_discription              : task_discription,
        created_at                    : Date.now(),
        task_completion_status        : false,
        task_start_date               : task_start_date,
        task_end_date                 : task_end_date,     
      });
      notification.insert({
        notification_id         : "notification_"+Math.floor(1000 + Math.random() * 9000)+new Date().getTime(),
        notification_by         : user_id,
        notification_to         : assigned_to,
        notification_status     : true,
        notification_type       : 1,
        created_at              : Date.now(),

      });
      return true;
	},
	task_list_remove:function(id_listItem){
		task_list.update({_id : id_listItem },{ $set : {"task_status" : false}});
		return true;
	},
	task_list_edit:function(id_edit){
		value = task_list.findOne({_id :id_edit });
		console.log(value);
		return value;
	},
	task_list_edit_save:function(id_edit,update_value){
		task_list.update({_id : id_edit},{ $set : {"task_title" : update_value}});
		return true;
	},
	check_task_completed_status_true:function(checkbox_id){
		task_list.update({
        _id : checkbox_id
      },
      {
        $set:
          {  
            'task_completed' : true
          } 
      });
	},
	check_task_completed_status_false:function(checkbox_id){
		task_list.update({_id : checkbox_id},{$set :{ 'task_completed': false } });
	},
	check_if_assigned_task_completed:function(user_id){
		var find_assigned_to = notification.find({'notification_to': user_id});
		return find_assigned_to;
	},
	check_if_assigned_task_completed_status:function(checkbox_id,user_id,assigned_to){
		 task_assignment.update({
          _id : checkbox_id
        },
        {
          $set:
            {  
              'task_completion_status' : true,
              
            } 
        });
        notification.insert({
          notification_id         : "notification_"+Math.floor(1000 + Math.random() * 9000)+new Date().getTime(),
          notification_by         : user_id,
          notification_to         : assigned_to,
          notification_status     : true,
          notification_type       : 2,
          created_at              : Date.now(), 
        });
	},
	check_if_assigned_task_completed_status_false:function(checkbox_id){
		 task_assignment.update({_id : checkbox_id},{$set :{ 
        'task_completion_status': false,}  });
	},
	assigned_task_input:function(){
		var users = user_details.find({ }).fetch();
		return users;
	},
	task_start_time:function(task_id){
		return task_list.update({_id : task_id},{$set :{'task_start_time' : new Date().getTime()}});
	},
	task_end_time:function(task_id){
		var task_end_time = new Date().getTime();
		task_list.update({_id : task_id},{$set :{'task_end_time' : task_end_time}});
		return {"task_end_time":task_end_time};
	},
	task_reminder:function(user_id){
		SyncedCron.add({
  			name: 'Crunch some important numbers for the marketing department',
  			schedule: function(parser) {
    		// parser is a later.parse object
    		return parser.text('every 10 seconds');
  			},
  			job: function() {
    		var result = task_list.find({ 'user_id' : user_id });
    		console.log(result);
  			}
		});
  		SyncedCron.start();
	}
});