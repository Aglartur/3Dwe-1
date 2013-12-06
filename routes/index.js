
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', { title: '3Dwe'});
};



/*
 * created by Peng 12/06/13
 */

// exports.uploadifyhandler = function(req, res, next) {

//    var serverPath = '/Photos/' + req.files.Filedata.name;
 
//       require('fs').rename(
//         req.files.Filedata.path,
//         '/Users/ULTIMATE/CS326/UPDATE/master/public/home' + serverPath,
//         function (error) {
//           if(error) {
//           res.send({
//             error: 'Ah crap! Something bad happened'
//           });
//           return;
//         }
     
//         res.send({
//         path: serverPath
//         });
//       }
//     );

// };


exports.uploadHandler = function(req, res) {

    var allPath = "";
 
    var extension = req.files.userFile.name.split('.').pop();
    if (extension === 'mp3'){
        allPath = 'Jukebox/' + req.files.userFile.name;
    }else if (extension === 'mp4' || extension === 'MOV' || extension === 'webm' || extension === 'wmv'){
        allPath = '/videos/' + req.files.userFile.name;
    }else if (extension === 'pdf'){
        allPath = '/PDFs/' + req.files.userFile.name;
    }else if (extension === 'jpg'){
        allPath = '/Photos/' + req.files.userFile.name;
    }else if (extension === 'txt'){
        console.log("no txt folder");
    }


        require('fs').rename(
        req.files.userFile.path,
        '/Users/ULTIMATE/CS326/UPDATE/master/public/home' + allPath,
        function(error) {
            if(error) {
                res.send({
                    error: 'Ah crap! Something bad happened'
                });
                return;
            }
     
            res.send({
                path: allPath
            });
        }
    );
}