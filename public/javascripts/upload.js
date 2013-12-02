/*
  created by Peng 11/28/13
*/


$(function() {
      $('#file_upload').uploadify({
        'swf' : '/uploadify.swf',
        'uploader' : '/uploadifyhandler',
        // Your options here
        'fileTypeExts' : '*.gif; *.jpg; *.png; *.txt; *.wmv;',
        'buttonText' : 'Choose file',
        'removeCompleted' : true,
        'multi' : true
      });
   });


