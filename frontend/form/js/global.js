(function ($) {
  "use strict";

  /*[ File Input Config ]
        ===========================================================*/
  jQuery.support.cors = true;

  try {
    $(document).on("change", ".js-input-file .input-file", function () {
      var fileInput = $(this);
      var container = fileInput.closest(".js-input-file");
      var info = container.find(".input-file__info");

      var fileName = "";
      var files = fileInput[0].files;

      if (files && files.length > 0) {
        fileName = files[0].name;
      }

      if (fileName == "") {
        info.text("No file chosen");
      } else {
        info.text(fileName);
      }
    });
  } catch (e) {
    console.log(e);
  }
})(jQuery);

// (function ($) {
//   "use strict";

//   jQuery.support.cors = true;

//   try {
//     $(document).on("change", ".js-input-file .input-file", function () {
//       var fileInput = $(this);
//       var container = fileInput.closest(".js-input-file");
//       var info = container.find(".input-file__info");

//       var files = fileInput[0].files;

//       if (files && files.length > 0) {
//         fileInput[0].selectedFile = files[0]; // Store the selected file on the input element
//         info.text(files[0].name);
//       } else {
//         delete fileInput[0].selectedFile; // Remove the stored file reference
//         info.text("No file chosen");
//       }
//     });
//   } catch (e) {
//     console.log(e);
//   }
// })(jQuery);
