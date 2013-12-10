
/*
 * GET Home page.
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
//         '/Users/ULTIMATE/CS326/UPDATE/master/public/Home' + serverPath,
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



//Deprecated
// exports.uploadHandler = function(req, res) {

//     var allPath = "";
 
//     var extension = req.files.userFile.name.split('.').pop();
//     if (extension === 'mp3'){
//         allPath = 'Music/' + req.files.userFile.name;
//     }else if (extension === 'mp4' || extension === 'MOV' || extension === 'webm' || extension === 'wmv'){
//         allPath = '/Videos/' + req.files.userFile.name;
//     }else if (extension === 'pdf'){
//         allPath = '/PDFs/' + req.files.userFile.name;
//     }else if (extension === 'jpg' || extension === 'png' || extension === 'JPG' || extension === 'PNG'){
//         allPath = '/Photos/' + req.files.userFile.name;
//     }else if (extension === 'txt'){
//         console.log("no txt folder");
//     }


//         require('fs').rename(
//         req.files.userFile.path,
//         '/Users/ULTIMATE/CS326/UPDATE/master/public/Home' + allPath,
//         function(error) {
//             if(error) {
//                 res.send({
//                     error: 'Ah crap! Something bad happened'
//                 });
//                 return;
//             }
     
//             res.send({
//                 path: allPath
//             });
//         }
//     );
// }