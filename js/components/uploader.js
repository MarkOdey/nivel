
angular
   .module('nivel')
   .directive('uploader', [ "$parse", "FileManager", function ($parse, FileManager) {

      return {
        restrict: 'A',
        scope : {

          url : "@",
          fileName : "@",
          allowedTypes : "@",


        },
   
        link: function ($scope, $element, $attr) {

            var files = [];


            var onChangeHandler = $parse($attr.spotfulFileChange);
            $element[0].style.position = "relative";


            var inputElement = document.createElement('input');

            inputElement.type = "file";
            inputElement.multiple = true;

            inputElement.style.display = "block";
            inputElement.style.opacity = "0";
            inputElement.style.position = "absolute";
            inputElement.style.top = "0px";
            inputElement.style.left = "0px";

            inputElement.style.width = "100%";
            inputElement.style.height = "100%";

            $element[0].prepend(inputElement);


            inputElement.addEventListener('change', function(e) {

            console.log(inputElement);
            console.log(e);

            // Let s make sure there are files selected
            if(e.target.files.length != 0) {

               // Deep copy the reference of object in the array
               for(var i=0; i<e.target.files.length; i++){
                  

                  var file = FileManager.upload(e.target.files[0], $scope.url)
                  files.push(file);                       

               }

               if(files.length >= 1) {

                  // Wipe out the data.
                  inputElement.value = "";                        
               }

            }

            });
      
        }
	}
}]);