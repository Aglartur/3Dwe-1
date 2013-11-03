
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};
exports.new = function(req, res){
    res.render('register/signup',{ title: 'Sign Up'

    } );


};