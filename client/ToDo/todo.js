import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
//import {fontawesome} from 'fontawesome';
import { task_list } from '../../import/collections/insert.js';
import { user_details } from '../../import/collections/insert.js';
//import { task_assigned } from '../../import/collections/insert.js';
import { task_assignment } from '../../import/collections/insert.js';
import {  notification   } from  '../../import/collections/insert.js';
import { IronRouter } from 'meteor/iron:router';
import { Session } from 'meteor/session';
// import { MongoClient } from 'mongodb';
// import { MongoCron } from 'mongodb-cron';
// import { cron_jobs_reminder } from './../import/collections/insert.js';
// import { cron_reminder } from './../import/collections/insert.js';
Template.home.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});
Template.home.events({
//Function to capture clicks on submit button of To do task add form. 
  'click #todo_submit'(events) {
    events.preventDefault();
    var task_title            = $("#list_item").val();
    var task_id               = "task_"+Math.floor(1000 + Math.random() * 9000)+new Date().getTime();
    Session.setPersistent('date_find', task_title);
    var assigned_name         = $("#assigned_task_input").val();
    var task_discription      = $("#task_discription").val();
    var task_start_date       = $("#task_start_date").val();
    var task_end_date         = $("#task_end_date").val();
    var start_date            = $('#start_date').val();
    var due_date              = $("#due_date").val();
    var splitstring           = assigned_name.split(", ");
  
   
    var user_id = Session.get('mySession');
    var checked_data = Session.get('checked_data');
    var regex = /[a-zA-z]{,15}$/;
     
    if($('#assign_task').is(':checked')){
      if(assigned_name==null|| assigned_name==""){
        //alert('You Cannot Blank the Assigned Field If you Checked');
        swal("You Cannot Blank the Assigned Field and Please Fill assigned Field with name separated  by comma and space(eg: name1,<space>name2, etc.)");
        return false;
      }
      else{
        for(var i=0;i<(splitstring.length)-1;i++){
          var checkname = user_details.find({'user_name' : splitstring[i]}).fetch();
        }
        if(assigned_name.match(/, /g)=== null){
          swal({
            title : "Wrong input",
            text  : "please put the , and <space> at last of the string",
            icon  : "error",
          });
          return false;
        }
        if(checkname[0]){
          swal({
            title : "Task Assigned Successful",
            icon  : "success"
          });
        }
        else{
          swal("Please Select the Suggestions by putting Two value in text box of assigned field");
          document.getElementById('list_item').value='';
          document.getElementById('assign_task_input').value='';  

          return false;
        }
      }
    }
    var todo_check = regex.test(task_title);
    if(task_title=="" && todo_check == false){
      alert("enter Your Todo now it is blanks");
      return false;
    }
    // if( start_date == null || start_date=="" ){
    //   swal({
    //     title : 'start date Should not be blank',
    //     icon  : 'error'
    //   });
    //   return false;
    // }
    // if( due_date == null || due_date == "" ){
    //   swal({
    //     title : 'due date Should not be blank',
    //     icon  : 'error'
    //   });
    //   return false;
    // }
    // if(start_date===due_date){
    //   swal({
    //     title  : 'Both the dates are not equal',
    //     icon   : 'error'
    //   });
    //   return false;
    // }
    // var current_Date = new Date();
    // start_date = new Date(start_date);
    // if(start_date < current_Date){
    //   swal({
    //     title  : ' Start Date should be future date',
    //     icon   : 'error'
    //   });
    //   return false;
    //   }
    //   due_date = new Date(due_date);
    // if(due_date < current_Date){
    //   swal({
    //     title  : ' Start Date should be future date',
    //     icon   : 'error'
    //   });
    //   return false;
    //   }
    // if(start_date>due_date){
    //   swal({
    //     title  : 'due date is previous to start date',
    //     icon   : 'error'
    //   });
    // }

    if(!($('#check_if_checked').is(':checked'))){

      if( start_date == null || start_date=="" ){
      swal({
        title : 'start date Should not be blank',
        icon  : 'error'
      });
      return false;
    }
    if( due_date == null || due_date == "" ){
      swal({
        title : 'due date Should not be blank',
        icon  : 'error'
      });
      return false;
    }
    if(start_date===due_date){
      swal({
        title  : 'Both the dates are not equal',
        icon   : 'error'
      });
      return false;
    }
    
    var current_Date = new Date();
    if(start_date < current_Date){
      swal({
        title  : ' Start Date should be future date',
        icon   : 'error'
      });
      return false;
      }
    
    if(due_date < current_Date){
      swal({
        title  : ' Start Date should be future date',
        icon   : 'error'
      });
      return false;
      }
    if(start_date>due_date){
      swal({
        title  : 'due date is previous to start date',
        icon   : 'error'
      });
    }
   
    Meteor.call("task_list",task_title,user_id,start_date,due_date,function(error,result){
      if(error){
        alert("error hai,dekh ke!!!");
      }
      else{
        swal({
        title : "added to Your Todo Task",
        icon  : "success",
         });
        document.getElementById('date-picker').value='';
      }
    });
      
    }
    else{
      swal({
      title : "assigned Your  Task",
      icon  : "success",
    });
    }
     
    
    
    document.getElementById('list_item').value='';
    
    var new_array = [];
    var input_string_length = assigned_name.match(/,/g).length;
    console.log(input_string_length);
      
    for(var i=0;i<input_string_length;i++){
      new_array.push(splitstring[i]);
    }
    console.log(new_array);
    

    for(var i=0;i<new_array.length;i++){
      var task_assign_to = new_array[i];
      //var find_user = user_details.find({'user_id' : user_id }).fetch();
      // var task_assign_by = find_user[0].user_name;
      //Session.setPersistent('task_assign_by' , task_assign_by  );
      var find_assigned_to    = user_details.find({'user_name'  : task_assign_to  }).fetch();
      var assigned_to = find_assigned_to[0].user_id;
      Session.setPersistent('assigned_to' , assigned_to );
      // Session.setPersistent(  'task_assign_to' ,    user_id_to );
      Meteor.call("task_assignment_notification",user_id,assigned_to,task_title,task_discription,task_start_date,task_end_date,function(error,result){
        if(error){
          alert("Error");
        }
        else{
          alert("assign a task");
        }
      });
      
    } 

  },
//Function to remove the task in todo list when click on remove icon.
  'click #remove'() {
    var id_listItem = this._id;
    swal({  
      title: "Your task will be deleted!",   
      text: "Are you sure to proceed?",   
      icon: "warning",   
      buttons: [
        'No, cancel it!',
        'Yes, I am sure!'
      ],
      dangerMode: true,
    }).then(function(isConfirm)
    {   
      if (isConfirm) 
      { 
        Meteor.call("task_list_remove",id_listItem,function(error,result){
          if(error){
            alert("ERROR,THERE IS SOMETHING WRONG");
          }
          else{
          swal({
          text : "Your Task deleted",
          icon : "success",
        });
          }
        }); 
        } 
      else{     
        swal("Your task is safe");   
      } 
    });
  },
  //function to capture when user wants to edit the task.
  'click #edit'(){
    id_edit = this._id;
     Meteor.call("task_list_edit",id_edit,function(error,result){
      if(error){
        alert("Error handle it");
      }
      else{
        console.log(result);
        Session.set('text_value', result.task_title );
      }
     });
    
  },
  //function to capture when user edit the task and save the edited task in Modal
  'click #saveChanges'(){
    
    var update_value = $('#' + this._id).val();
    
    console.log(id_edit);
    console.log(update_value);
    Meteor.call("task_list_edit_save",id_edit,update_value ,function(error,result){
      if(error){
        alert("Error is there");
      }
      else{
        swal({
          titlr : "Your Value is Updated Successfully",
          icon  : "success",
        });
      }
    });
    
  },
  //function to capture when user clicks on logout button
 'click #logout'(){
    Session.setPersistent('mySession',''); 
    swal({
      title : "Logged Out",
      text  : "Thanks For Visiting us",
      icon  : "success",
    });
  },
 'click #login'(){
    Router.go('/');
 },
  //Function to capture when checkbox is checked it shows that task is completed and save the checked status in database.
  'click #check_task_completed'(){
    var checkbox_id  = this._id;
    console.log(checkbox_id);
    var check_id = this.task_completed;
    console.log(check_id);
    if(!check_id){
      Meteor.call("check_task_completed_status_true",checkbox_id,function(error,result){
        if(error){
          alert("ERROR!!!!!!");
        }
        else{

        }
      });
    }
    else{
      Meteor.call("check_task_completed_status_false",checkbox_id,function(error,result){
        if(error){
          alert("Error");
        }
        else{

        }
      });
      
   }
  },
   //Function to capture when checkbox is checked it shows that task is completed which was assigned and save the checked status in database.
  'click #check_if_assigned_task_completed'(){
    // alert("case1");
    var checkbox_id  = this._id;
   var user_id = Session.get('mySession');
    Meteor.call("check_if_assigned_task_completed",user_id,function(error,result){
      if(error){
        alert("Error is there");
      }
      else{
        var find_assigned_to = result;
        var assigned_to = find_assigned_to[0].notification_by;
      }
    });
   
   
  
    var check_id = this.task_completion_status;
    console.log(check_id);
    Session.setPersistent('task_completion_status',check_id);
    Session.setPersistent('checkbox_id',checkbox_id);
    swal({  
      title: "Task completed!",   
      text: "Are you sure Your given task is completed",   
      icon: "warning",   
      buttons: [
        'No, cancel it!',
        'Yes, I am sure!'
      ],
      dangerMode: true,
    }).then(function(isConfirm)
    {   
      if (isConfirm) 
      {   
        if(!check_id){
        Meteor.call("check_if_assigned_task_completed_status",checkbox_id,user_id,assigned_to,function(error,result){
          if(error){

          }
          else{

          }
        });  
         
    }
        swal({
          text : "Your task is complted and it will not show you after confirm",
          icon : "success",
        }); 
      } 
      else{     
        swal("Ok means Your task is not completed");
        Meteor.call("check_if_assigned_task_completed_status_false",checkbox_id,function(error,result){
          if(error){
            alert("Error");
          }
          else {

          }
        }); 
           
      } 
    });
    // alert("case2")
    // if(!check_id){
    //   // alert("case3")
    //   task_assignment.update({
    //     _id : checkbox_id
    //     },
    //     {
    //       $set:
    //         {  
    //           'task_completion_status' : true,
              
    //         } 
    //     });
    //     // $('#strike').addClass('strike_text');
    //     notification.insert({
    //       notification_id         : "notification_"+Math.floor(1000 + Math.random() * 9000)+new Date().getTime(),
    //       notification_by         : user_id,
    //       notification_to         : assigned_to,
    //       notification_status     : true,
    //       notification_type       : 2,
    //       created_at              : Date.now(), 
    //     });
    // }
    // else{
    //   // alert("case4")
    //   task_assignment.update({_id : checkbox_id},{$set :{ 
    //     'task_completion_status': false,
       
    //   } 
    // });
    //      // $('#strike').removeClass('strike_text');
         
    // }
  },
  //Function to capture the checkbox when it is checked than Input box appears for task assigning.
  'click #check_if_checked'(){
    var assign_task_id = this.check_if_checked;
    if( $('#check_if_checked').is(':checked')){
      $('#assigned_task_input').removeClass('hide_display');
       $('#task_discription').removeClass('hide_display');
        $('#task_start_date').removeClass('hide_display');
         $('#task_end_date').removeClass('hide_display');
         $('#due_date_show_hide').addClass('hide_display');
         $('#start_date_show_hide').addClass('hide_display');
         $('#dates_label_start').removeClass('hide_display');
          $('#dates_label_end').removeClass('hide_display');
        swal("Both the fields are primary fields. \n To assign a task you need to type two letter in order to get Suggestions. \n We can also assign multiple user same task separated by comma(,) and followed by <space>");
    }
    else{
      $('#assigned_task_input').addClass('hide_display');
       $('#task_discription').addClass('hide_display');
       $('#task_start_date').addClass('hide_display');
       $('#task_end_date').addClass('hide_display');
        $('#due_date_show_hide').removeClass('hide_display');
        $('#start_date_show_hide').removeClass('hide_display');
        $('#dates_label_start').addClass('hide_display');
         $('#dates_label_end').addClass('hide_display');
        swal("put your todos only");
    }
  },
  //Function to show the suggestions when putting first two character of the name which is present in the system.
  'click #assigned_task_input'(){
   Meteor.call("assigned_task_input",function(error,result){
    if(error){
      alert("error");
    }
    else{
      var users = result;
    }
   });
     users = user_details.find({ }).fetch();
    var user_array = [];
    console.log(user_array);
    for(var i=0;i<users.length;i++){
      var label = users[i].user_name;
      var users_id = users[i].user_id;
      var new_array = {
        "label"  : label,
        "user_id": users_id,
      };
      user_array.push(new_array);
    }
    console.log(user_array);
    $( function() {
      function split( val ) {
        return val.split( /,\s*/ );
      }
      function extractLast( term ) {
        return split( term ).pop();
      }
      var count = 0 ; 
      $( "#assigned_task_input" )
      // don't navigate away from the field on tab when selecting an item
      .on( "keydown", function( event ) {
        if ( event.keyCode === $.ui.keyCode.TAB &&
          $( this ).autocomplete( "instance" ).menu.active ) {
          event.preventDefault();
        }
        })
        .autocomplete({
          source: function( request, response ) {
            // delegate back to autocomplete, but extract the last term
            response( $.ui.autocomplete.filter(
              user_array, extractLast( request.term ) ) );
              // $.getJSON("users.js", {
              //   term: extractLast( request.term )
              // }, response );
          },
          search: function() {
          // custom minLength
          var term = extractLast( this.value );
          if ( term.length < 2 ) {
            return false;
          }
          },
          focus: function() {
            // prevent value inserted on focus
            return false;
          },
          select: function( event, ui ) {
            var terms = split( this.value );
            // remove the current input
            terms.pop();
            // add the selected item
            terms.push( ui.item.value );
            // add placeholder to get the comma-and-space at the end
            terms.push( "" );
            this.value = terms.join( ", " );
            // var new_item = (this.value).split();
            // console.log(new_item[0]);
            var task_assign_to = ui.item.value;
            var task_assign_to_array = [];
            console.log(task_assign_to_array);
            console.log(task_assign_to_array[1]);
            return false;
          }
        });
    });
  },
  //when click on input of due date a datepicker appears
  'click #due_date'(){
      var due_date_id = this._id;
      console.log();

    $("#due_date").datepicker({dateFormat : "mm/dd/yy"});
      // showOn: "button",
     
      // buttonImageOnly: true,
      // buttonText: "Select date",
    //    onSelect: function(){
    //     var due_date = $(this).val();
    //     task_list.update({_id : due_date_id},{$set:{'due_date' : due_date}});

    //     }
    // });
   document.getElementById('due_date').value='';
  },
  //when click on input of start date a datepicker appears
  'click #start_date'(){
    

    $("#start_date").datepicker({dateFormat : "mm/dd/yy"});

      // showOn: "button",
     
      // buttonImageOnly: true,
      // buttonText: "Select date",
    //    onSelect: function(){
    //     var due_date = $(this).val();
    //     task_list.update({_id : due_date_id},{$set:{'due_date' : due_date}});

    //     }
    // });
   document.getElementById('start_date').value='';
  },
  //Button for capture the start and end time of the task
  'click #task_start_time'(){
    console.log(this);
    var task_id = this._id;
    Session.setPersistent('task_id', task_id);
    console.log(task_id);
    $('#'+this._id).prop('disabled',false);
    Meteor.call('task_start_time',task_id,function(error,result){
      if(error){
        alert("error");
      }
      else{
        console.log(result);
      }
    });
    var x = document.getElementById("show_start_time");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  },
  'click .capture_task_end_time'(){
    
    var task_id = this._id;
    Session.setPersistent('task_id', task_id);
    console.log(task_id);
    var start_time = this.task_start_time;
    console.log(start_time);
    Meteor.call('task_end_time',task_id,function(error,result){
      if(error){
        alert("error");
      }
      else{
          console.log(result);
          var x = document.getElementById("show_end_time");
          x.className = "show";
          setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
          var y = document.getElementById("total_time_taken");
          y.className = "show";
          setTimeout(function(){ y.className = y.className.replace("show", ""); }, 3000);
          console.log(start_time);
          // difference = moment(result.task_end_time).diff(start_time, 'seconds');
          // console.log(difference);
          // Session.setPersistent('difference', difference);
          var total_completion_time = result.task_end_time - start_time ;
          alert(total_completion_time);
          Session.setPersistent('total_completion_time',total_completion_time);
      }
    });
      
  },
});
//This is helper template in which all the helpers are there.
Template.home.helpers({
  //This helper is used to show the data in todo list 
  show(){

    var user_id = Session.get('mySession');
    Meteor.subscribe("fetch_task_list",user_id);
    var date  = new Date();
    return task_list.find({
      'user_id'     : user_id,
      'task_status' : true,
    },{sort: {created_at: -1}}).fetch();
  },
  //helper to show the task start and end date in showing format
  task_start_end_date(){
    var user_id = Session.get('mySession');
   
    var start_date = this.start_date;
    console.log(start_date);
    var end_date   = this.due_date;
    var task_start_date = moment(start_date).format("MMM DD,YYYY");
    
    var task_end_date = moment(end_date).format("MMM DD,YYYY");
    
  return {
    'start_date' : task_start_date ,
    'end_date'   : task_end_date,
  };
  },
   //helper function which show the date when you created your todo.
  format_date(){
    var user_id = Session.get('mySession');
     
   
    var date = task_list.find({'user-id' : user_id}).fetch();
    return moment(this.created_at).format("MMM DD,YYYY");
  },
  //Helper function is used to maintain the session.
  mySession(){
    var session_login = Session.get("mySession");
    // var session_signup = Session.get('mySession_signup');
    return session_login;
  },
  //Helper function is used to show the name of user at the top which is logged in.
  username(){
    var session_data = Session.get('mySession');
    // var session_signup = Session.get('mySession_signup');
     Meteor.subscribe("fetch_user_details",session_data);
    var result_1 = user_details.find({"user_id" :  session_data }).fetch();
    // var result_2 =logindb.find({"email" : session_signup}).fetch();
    console.log(result_1);
    // console.log(result_2[0].user);
    if(result_1[0]){
      var string = result_1[0].user_name ;
      return string.charAt().toUpperCase()+string.slice(1);
    }
  },
  //Helper function is used to get the value of the clickable item in modal when click on edit icon
  value(){
    var text_value_modal = Session.get("text_value");
    return text_value_modal;
  },
  //Helper function is used to retain the status of checked
  task_completed(){
    var task_id = this._id;
    // var mail = Session.get('mySession');
    // Meteor.subscribe("task_completed",task_id);
    var result = task_list.find({_id : task_id}).fetch();
    console.log(result);
    if(result[0].task_completed == true){
      return true;
    }
  },
  // Helper function is used to retain the status of checked in task assigned by section.
  assigned_task_completed(){
    var task_id = this._id;
    console.log(task_id);
    Session.setPersistent('check_2',task_id);
     // Meteor.subscribe("assigned_task_completed",task_id);
    var result = task_assignment.find({_id : task_id}).fetch()

    if(result[0].task_completion_status == true){
      return true;
    }
  },
  //helper function is used to show the task which was assigned by you to someone
  task_assigned_to(){
    var user_id   = Session.get('mySession');
     Meteor.subscribe('fetch_assigned_task_to', user_id);
    // var task_assign_by_1 = Session.get('task_assign_to');
    // return task_assignment.find({ 'user_id_by' : task_assign_by },{sort: {created_at: -1}}).fetch();
    return task_assignment.find({"assigned_by" : user_id},{sort: {created_at: -1}}).fetch(); 
   
  },
  //helper function is used to show the task which was assigned to you by someone
  task_assigned_by(){
    var user_id = Session.get('mySession');
    //var assign_by = Session.get('task_assign_by');
    //console.log(assign_by);
    //var find_table = task_assignment.find({ }).fetch();
    //console.log(find_table);
    Meteor.subscribe('fetch_assigned_task_by', user_id);
    return task_assignment.find({
      'assigned_to'             : user_id,
      'task_completion_status'  : false,
        },{sort: {created_at: -1}}).fetch();
  },
  //helper function used to show the name of users who assigned the task to login user.
  info_user_by(){
    var username = this;
    var user_by = username.assigned_by;
     Meteor.subscribe('assigned_by_user_name', user_by);
    return user_details.find({'user_id' : user_by}).fetch();
  },
  //helper function used to show the name of users to whom task is assigned by user.
  info_user_to(){
    var username = this;
     var user_to = username.assigned_to;
      Meteor.subscribe('assigned_to_user_name', user_to);
    return user_details.find({"user_id" : user_to }).fetch();
  },
  //helper function is used to show the notifications
  notification(){
    var user_id_details = Session.get('mySession');
    var notification_id = notification.find({'notification_to' : user_id_details }, {sort: {created_at: -1}}).fetch();
    var notification_username = notification_id[0].notification_by;
    // Meteor.subscribe('notification',notification_username);
    return user_details.find({'user_id' : notification_username}).fetch();
  },
  //helper function is used to show the notifications to the assigned person
  // notifications(){
  //   var notification_from =  this;
  //   console.log(this);
  //   var user_from = notification_from.notification_by;
  //   console.log(user_from);
  //   // return user_details.find({"user_id" : user_from,},{sort: {created_at: -1}}).fetch();
  //   return user_details.find({"user_id" : user_from},{sort: {created_at: -1}}).fetch();
    
  // },
  //helper function is used to find that the task is completed than notification goes to assignee.
  user_task_completed(){
  //  var find_task_assignment =  Session.get('check_2');
  // console.log(find_task_assignment);
  //  var task_assignment = task_assignment.find({ _id : find_task_assignment }).fetch();
  //   console.log(task_assignment);
  // alert(task_completion_status);
  //  if(task_completion_status==true){
  //   return true;
  //  }
  //  else{
  //   return false;
  //  }
  var assigned_to_id = Session.get('mySession');
  // Meteor.subscribe('user_task_completed',assigned_to_id);
  var notification_assigned_to = notification.find({'notification_to' : assigned_to_id }).fetch();
  if(notification_assigned_to[0].notification_type==2){
    return true;
  }
  else {
    return false;
  }
  },
  task_assigned_date_to(){
    var user_id = Session.get('mySession');
    // Meteor.subscribe('task_assigned_date',user_id);
    var assigned_date = task_assignment.find({'assigned_by' : user_id}).fetch();
    var created_at = this.created_at;
    var start_date = this.task_start_date;
    var end_date = this.task_end_date;
      var task_created_at  = moment(created_at).format("MMM DD,YYYY");
      var task_start_date = moment(start_date).format("MMM DD,YYYY");
      var task_end_date   =  moment(end_date).format("MMM DD,YYYY");
      return {
        "task_created_at"  : task_created_at,
        "task_start_date"  : task_start_date,
        "task_end_date"     : task_end_date,
      };
  },
  task_assigned_date_by(){
    var user_id = Session.get('mySession');
    var assigned_date = task_assignment.find({'assigned_to' : user_id}).fetch();
      var created_at = this.created_at;
    var start_date = this.task_start_date;
    var end_date = this.task_end_date;
    var task_created_at  = moment(created_at).format("MMM DD,YYYY");
      var task_start_date = moment(start_date).format("MMM DD,YYYY");
      var task_end_date   =  moment(end_date).format("MMM DD,YYYY");
      return {
        "task_created_at"  : task_created_at,
        "task_start_date"  : task_start_date,
        "task_end_date"     : task_end_date,
      };
  },
  // task_is_completed_notify(){
  //   var task_completion_status = Session.get('task_completion_status');
  //   var checkbox_id            = Session.get('checkbox_id');
  //   console.log(task_completion_status,checkbox_id);
  //   if(task_completion_status===false){
  //     var result = task_assignment.find({_id : checkbox_id}).fetch();
  //     var username = result[0].assigned_to;
  //     var json = {
  //       username:username,
  //       status:true
  //     };
  //     return [ username , true ];
  //   }
  //   else{
  //     return false;
  //   }
  // },
  // task_time_show(){
  //   var user_id = Session.get('mySession');
  //  // Meteor.subscribe("fetch_task_list",user_id);
  //   var start_time= task_list.find('user_id' : user_id).fetch();
  //   console.log(start_time);
  //   return start_time.task_start_time;
  // },
  show_task_start_time(){
   
    console.log(this);
    var start_date = this.task_start_time;
    console.log(start_date);
    return moment(start_date).format("hh:mm:ss");
  },
  show_task_end_time(){
    console.log(this);
    var end_date = this.task_end_time;
    console.log(end_date);
    return moment(end_date).format("hh:mm:ss");
  },
  total_time_to_complete_task(){
      var task_completion_time = Session.get('total_completion_time');
      console.log(task_completion_time);
      var mins = Math.floor(task_completion_time / 60000);
      console.log(mins);
      var hrs = Math.floor(mins / 60);
      console.log(hrs);
      var days = Math.floor(hrs / 24);
      console.log(days);
      var yrs = Math.floor(days / 365);
       console.log(yrs);
      // append(dl, "In minutes: ", mins + " minutes");
      // mins = mins % 60;
      // append(dl, "In hours: ", hrs + " hours, " + mins + " minutes");
      // hrs = hrs % 24;
      // append(dl, "In days: ", days + " days, " + hrs + " hours, " + mins + " minutes");
      var time = moment(task_completion_time).format("ss");
      console.log(time);
      return time;
      // var diff = Session.get('difference');
      // var time = moment(diff).format("ss");
      // return time;
  },
  reminder(){
    var user_id = Session.get('mySession');
    console.log(user_id);
    Meteor.subscribe("task_reminder",user_id);
    var result = notification.find({'notification_by' : user_id}).fetch();
    console.log(result);
    if(result.notification_type_reminder==0){
      $('#task_reminder').removeClass('task_reminder_class');
       console.log(this._id);
      var due_date_reminder = task_list.find('user_id' : user_id);
      console.log(due_date_reminder);
      return task_list.find({'user_id' : user_id }).fetch();
    }
    return task_list.find({'user_id' : user_id }).fetch();

  },
});