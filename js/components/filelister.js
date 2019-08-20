
angular
   .module('nivel')
   .directive('filelister', [ 'FileManager', '$http', function (FileManager, $http) {

      return {
      	restrict: 'E',
         templateUrl : "js/partials/file-lister.html",
      	scope : {

      	},

      	link: function ($scope, $element, $attr) {

            $scope.downloadFolder = function (folder) {

               FileManager.downloadFolder(folder);
            }


            $scope.deleteUpload = function (upload) {

               console.log(upload);
               var index = $scope.uploads.indexOf(upload);

               $scope.uploads.splice(index,1);



            } 

            $scope.deleteFolder = function (folder) {

               FileManager.deleteFolder(folder);

            }

            $scope.uploads = FileManager.uploads;


            FileManager.on('uploadAdded', function(file) {

               $scope.uploads = FileManager.uploads;

               console.log($scope.uploads);

               window.setTimeout(function() {

                  $scope.$apply();

               },0);

            });

            FileManager.on('progressUpdated', function(file) {

               window.setTimeout(function() {

                  $scope.$apply();

               },0);


            });


            FileManager.getFolders();


            FileManager.on('updated', function ()  {

               console.log('updated');

               $scope.folders = FileManager.folders;

               console.log($scope.folders);


               window.setTimeout(function() {

                  $scope.$apply();

               },0);

            });

      	}

      }

   }]);

angular
   .module('nivel')
   .directive('filelisteritem', [ 'FileManager', function ( FileManager) {

      return {
         restrict: 'E',
         templateUrl : 'js/partials/file-lister-item.html',
         scope : {
            data : "="
         },

         link: function ($scope, $element, $attr) {


            console.log($scope.data);


            $scope.delete = function () {

               console.log($scope.data);

               FileManager.deleteFile($scope.data);
            }

            $scope.download = function () {

               FileManager.downloadFile($scope.data);

            }


         }

      }

   }]);
