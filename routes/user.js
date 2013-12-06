var model = require('../lib/model');
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.new = function(req, res){
    var authmessage = req.flash('add_auth') || '';

    res.render('user/register/signup',{ title: 'Sign Up',
        message : authmessage
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

        if(email === undefined || email === " " || email==="" || validate_email(email) === false){
            errorMessage = "Email is invalid | ";
        }
        if(password === undefined || password === "" || password === " " || validate_pass(password) == false){
            errorMessage += "Pass word at least one number, one lowercase and one uppercase letter and 6 in length";
        }
        model.lookup(email, password, function(error,user) {

            if(user === undefined){
                errorMessage += "Email or Password is incorrect!";
            }else{
            if (user.email !== email){
                errorMessage += "Email is incorrect or not exist! |";
            }
            if(user.password !== password){
                    errorMessage += "Password is incorrect!";
             }
            }
            if (error || errorMessage !== "") {
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
            fname : user.fname,
            lname : user.lname});
    }
};

exports.add_auth = function (req,res){

}

exports.user_add = function (req, res) {
    var email = req.query.email;
    var fname = req.query.fname;
    var lname = req.query.lname;
    var password  = req.query.password;
    var confirm = req.query.confirm_password;
    var errorMessage = "";

    if (email === undefined || email === " " || email==="" || validate_email(email) === false){
            errorMessage = "Email is invalid | ";
    }
    if(fname === undefined || fname === " " || fname === ""){
        errorMessage += "First Name is invalid | ";
    }
    if(lname === undefined || lname === " " || lname === ""){
        errorMessage += "Last Name is invalid | ";
    }
    if(fname.length >= 20){
        errorMessage += "First Name length cannot be longer than 20 | ";
    }
    if(password !== confirm){
        errorMessage += "Password doesn't match | ";
    }
    if(password === undefined){
        errorMessage += "Password field is empty | ";
    }
    if(confirm === undefined){
        errorMessage += "Confirm Password field is empty | ";
    }
    if(validate_pass(password) == false){
        errorMessage += "Pass word at least one number, one lowercase and one uppercase letter and 6 in length";
    }
    if(errorMessage!== ''){
        req.flash('add_auth', errorMessage);
        res.redirect('/signup');
        errorMessage = '';
    }
    else {
        model.addUser(email,fname, lname, password, function (err, rows) {
            if (err) {
                console.error('db failed: ' + err);
            }
            res.redirect('/login');
        });
    }
};

function validate_email(email){
    var VALID_EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return VALID_EMAIL_REGEX.test(email);
}

function validate_pass(password){
    var VALID_PASS_REGEX = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    return VALID_PASS_REGEX.test(password);
}