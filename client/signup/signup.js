import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { user_details } from '../../import/collections/insert.js';
import { IronRouter } from 'meteor/iron:router';
//import { collections } from './../../server/main.js';
Template.signup.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});
Template.signup.events({
//Function to capture the submit button for signup.
'click #submitButton'(events) {
  events.preventDefault();
  var username_string = $("#username").val();
  var mail     = $("#mail").val();
  var password = $("#password").val();
  var pattern  = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var varify_password =/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  var username = username_string.charAt().toUpperCase()+username_string.slice(1);
  if(username == "" || username == null)
    {
      $("#username").addClass('empty_filed');
      return false;
    }
  var isValid = pattern.test(mail);
  if(mail != null && isValid == false)
    {
      alert("please enter a mailID");
      $("#mail").addClass('empty_filed');
      document.getElementById('username').value='';
      document.getElementById('mail').value=''; 
      document.getElementById('password').value='';
      return false;
    }
  var isValidPassword = varify_password.test(password);
  if(isValidPassword== false )
  {
    swal({
      title : "Password Format is not Correct",
      text  : "Password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters",
      icon  : "info",
    });
    document.getElementById('username').value='';
    document.getElementById('mail').value=''; 
    document.getElementById('password').value='';
    return false;
  }
  if(password == "" || password == null)
  {
    $("#password").addClass('empty_filed');
    return false;
  }
  Meteor.call("user_signup",username,mail,password,function(error,result){
      if(error){
        alert("Error aa gya");
      }else{
        if(result == "email_already_exists"){
           swal({
                title : "Email Error",
                text  : "This mail Id is present in our system So use different EmailId",
                icon  : "info"
              });
            document.getElementById('username').value='';
            document.getElementById('mail').value=''; 
            document.getElementById('password').value=''; 
            return false;
        }else{
              swal({
                      title : "Welcome",
                      text  : "You are Register",
                      icon  : "success",
                    });
               Session.setPersistent( 'mySession' , result);
               Session.setPersistent( 'assign_by' , mail);
               Router.go('home');
               return false;
        }
      }
  });

  
  
  
},
//function to capture when click on login button in sigunp page and it shows the login page.
'click #already-exist'(){
  Router.go('/');
},
});

