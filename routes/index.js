
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('main', { title: 'Main Room'});
};

exports.uploadifyhandler = function(req, res, next) {

   var serverPath = '/pic_uploads/' + req.files.Filedata.name;
 
      require('fs').rename(
        req.files.Filedata.path,
        '/Users/ULTIMATE/CS326/BEN/master/public' + serverPath,
        function (error) {
          if(error) {
          res.send({
            error: 'Ah crap! Something bad happened'
          });
          return;
        }
     
        res.send({
        path: serverPath
        });
      }
    );

};