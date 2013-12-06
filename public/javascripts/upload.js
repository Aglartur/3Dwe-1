/*
  created by Peng 11/28/13
*/

// $(function() {

//     $('#file_upload').uploadify({
//         'swf' : '/uploadify.swf',
//         'uploader' : '/uploadifyhandler',
//         // Your options here
//         'fileTypeExts' : '*.gif; *.jpg; *.png; *.txt; *.wmv;',
//         'buttonText' : 'Choose text',
//         'removeCompleted' : true,
//         'multi' : true
//       });
//     });



$(document).ready(function() {
 
    status('Choose a file :)');
 
    // Check to see when a user has selected a file


    $('#uploadForm').change(function() {
      $(this).submit();
    });
 
    $('#uploadForm').submit(function() {
        status('uploading the file ...');
 
        $(this).ajaxSubmit({                                                                                                                 
 
        error: function(xhr) {
            status('Error: ' + xhr.status);
        },
 
        success: function(response) {
     
          if(response.error) {
              status('Opps, something bad happened');
              return;
          }
   
          var OnServer = response.path;
   
          status('Success, file uploaded to:' + OnServer);
          showSubfolders(currentDirectory);
        }

      });
                                                                                                                     
      return false;
    });
 
    function status(message) {
      console.log(message);
    }
});
