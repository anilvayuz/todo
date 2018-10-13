import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { user_details } from '../../import/collections/insert.js';
import { Session } from 'meteor/session'
import { IronRouter } from 'meteor/iron:router';
Template.login.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});
//Function to capture the login submit button
Template.login.events({
  'click #logged'(events){
    events.preventDefault();
    var loguser = $('#loguser').val();
    var logpassword = $("#logpassword").val();
    var pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var isValid = pattern.test(loguser);
    if (loguser != null && isValid == false){
      swal("Fill the email in correct format");
      $("#loguser").addClass('empty_filed');
      return false;
    }
    if(loguser == "" || loguser == null){
      $("#loguser").addClass('empty_filed');
    }
    if(logpassword == "" || logpassword == null){
      $("#logpassword").addClass('empty_filed');
    }
    Meteor.call("user_login",loguser,logpassword,function(error,result){
      if(error){
        alert("error aayi hai bhai saab");
      }
      else {
         if(result.length != 0)
              {
                Session.setPersistent('mySession', result[0].user_id);
                var session_data = Session.get('mySession');
                console.log(session_data);
                Session.setPersistent( 'assign_by' , loguser);
                swal({
                  title : "Logged In",
                  icon  : "success",
                });
                Router.go('home');
              }
         else
              {
                swal({
                  title : "Something is wrong",
                  text  : "Not Logged In",
                  icon  : "error",
                });
              }
      }
    });
    

   
    
    document.getElementById('loguser').value='';
    document.getElementById('logpassword').value='';
  },
//function to capture when click on signup link on login page.
  'click #Signup'(){
    Router.go('signup');
  },
});

