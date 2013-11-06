
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.uploadify = function(req, res) {
    res.render('uploadify');
};
 
exports.uploadifyhandler = function(req, res, next) {
   // require('fs').rename(req.files.Filedata.path, req.files.Filedata.path
   //   + '.'
   //   + req.files.Filedata.name.substr(req.files.Filedata.name.indexOf('.')+1).toLowerCase(), function(){
   // });
 
   // if(req.files.Filedata.path)
   //     res.send(JSON.stringify({success: true}), {'Content-Type': 'text/plain'}, 200);
   // else
   //     res.send(JSON.stringify({success: false, error: err}), {'Content-Type': 'text/plain'}, 404);
   var serverPath = '/images/' + req.files.Filedata.name;
 
      require('fs').rename(
        req.files.Filedata.path,
        '/Sites/BIG/master/public' + serverPath,
        function(error) {
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
