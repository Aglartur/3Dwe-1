var model = require('../lib/model');
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.new = function(req, res){
    res.render('user/register/signup',{ title: 'Sign Up'

    } );
};


// A logged in "database":
var online = {};

// # User Server-Side Routes

// ## login
// Provides a user login view.
exports.login = function(req, res){
    // Grab any messages being sent to use from redirect.
    var authmessage = req.flash('auth') || '';

    // TDR: redirect if logged in:
    var user  = req.session.user;

    // TDR: If the user is already logged in - we redirect to the
    // main application view. We must check both that the `userid`
    // and the `online[userid]` are undefined. The reason is that
    // the cookie may still be stored on the client even if the
    // server has been restarted.
    if (user !== undefined && online[user.acc_id] !== undefined) {
        res.redirect('/user/main');
    }
    else {
        // Render the login view if this is a new login.
        res.render('user/login/login', { title   : 'User Login',
            message : authmessage });
    }
};

// ## auth
// Performs **basic** user authentication.
exports.auth = function(req, res) {
    // TDR: redirect if logged in:
    var user = req.session.user;

    // TDR: do the check as described in the `exports.login` function.
    if (user !== undefined && online[user.acc_id] !== undefined) {
        res.redirect('/user/main');
    }
    else {
        // Pull the values from the form.
        var errorMessage="";
        var email = req.body.email;
        var password = req.body.password;
        // Perform the user lookup.
        console.log("Prepare to lookup");
        model.lookup(email, password, function(error,user) {

            if(user === undefined){
                error = true;
                errorMessage = "User not found!";
            }else{
            if (user.email === undefined){
                error = true;
                errorMessage += "Email is incorrect or not exist!";
            }
            if(user.fname === undefined ||
                user.lname === undefined ){
                error = true;
                errorMessage += "Name not Exist!";
            }
            if(user.password === undefined){
                    error = true;
                    errorMessage += "Password is incorrect!";
             }
            }
            if (error) {
                console.log("Error in lookup");
                // If there is an error we "flash" a message to the
                // redirected route `/user/login`.
                req.flash('auth', errorMessage);
                res.redirect('/login');
                errorMessage = "";
            }
            else {
                console.log("Success in lookup");
                req.session.user = user;
                // Store the user in our in memory database.
                online[user.acc_id] = user;
                // Redirect to main.

                console.log("Redirecting to main");
                res.redirect('/user/main');
            }
        });
    }
};


// ## logout
// Deletes user info & session - then redirects to login.
exports.logout = function(req, res) {
    var user = req.session.user;
    if (user === undefined || online[user.acc_id] === undefined) {
        req.flash('auth', 'Not logged in!');
        res.redirect('/login');
        return;
    }

    if (online[user.acc_id] !== undefined) {
        delete online[user.acc_id];
    }

    delete req.session.user;
    res.redirect('/login');
};

// ## main
// The main user view.
exports.main = function(req, res) {
    // TDR: added session support
    var user = req.session.user;

    if (user === undefined || online[user.acc_id] === undefined) {
        req.flash('auth', 'Not logged in!');
        res.redirect('/login');
    }
    else {
        res.render('main', { title   : 'User Main',
            message : 'Login Successful',
            email : user.email,
            password : user.password,
            fname : user.fname,
            lname : user.lname});
    }
};

exports.user_add = function (req, res) {
    var email = req.query.email;
    var fname = req.query.fname;
    var lname = req.query.lname;
    var pass  = req.query.password;

    if (
        email === undefined ||
        fname === undefined ||
        lname === undefined ||
        pass === undefined) {
        res.redirect('/signup');
    }
    else {
        model.addUser(email,fname, lname, pass, function (err, rows) {
            if (err) {
                console.error('db failed: ' + err);
            }
            res.redirect('/login');
        });
    }
};
