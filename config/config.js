
Router.route('/', function () {
	
  	this.render('login');
});


 Router.route('/signup', function () {
  this.render('signup');
});

Router.route('/home', function () {
	var session_route = Session.get('mySession');
	// var session_signup = Session.get('mySession_signup');
	if(session_route!= "" ){
		this.render('home');

	}
	else{
		this.render('login');
	}
  
});

