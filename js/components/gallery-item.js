angular
   .module('nivel')
   .directive('galleryItem', [ '$timeout', 'GalleryService', function ($timeout, GalleryService) {
  
      return {
        restrict: 'A',

        scope : true,

        link: function ($scope, $element, $attr) {

            $scope.gallery = {};

            $scope.shown = false;


            if($attr.id == undefined) {

                $scope.id = "galleryItem"+Math.round(Math.random()*100000);
                

            } else {

                $scope.id = $attr.id;
            
            }


            $scope.$on('gallery-instantiated', function(gallery) {

                console.log(gallery);


               if($attr.gallery == undefined) {

                  $scope.gallery = gallery.targetScope;

                 
               } else {

                  if($attr.gallery == gallery.targetScope.id) {

                     $scope.gallery = gallery.targetScope;


                     console.log($scope.gallery);
                  }

               }


               $scope.gallery.items.push($scope);
               GalleryService.add($scope);
            

            });


            $scope.show = function () {

               $element.addClass('active');

               $scope.shown = true;

               $scope.$emit('shown', $scope);

            }

            $scope.hide = function  () {

               $element.removeClass('active');

               $scope.shown = false;

               $scope.$emit('hidden', $scope);
             
            }

            $scope.$on('gallery-fullscreen', function (data) {

               if(data.targetScope.fullscreen) {

                  $element.append("<div class='caption'>"+$attr.caption+"</div>");

               } else {

                  $element.find(".caption").remove();

               }

            })


            $scope.$emit('rendered');

         }
      }
   }
]);



angular
   .module('nivel')
   .directive('fullscreen', [ '$timeout', 'GalleryService', function ($timeout, GalleryService) {
  
      return {
         restrict: 'A',
         scope : true,

         link: function ($scope, $element, $attr) {

            var gallery = $scope.$parent;

            if($attr.target != undefined) {

               gallery = GalleryService.get($attr.target);

            } else {

               $scope.$on('gallery-instantiated', function(e) {

                  gallery = e.targetScope;

               });
            
            }

            var getGallery = function () {
               
               if($attr.target != undefined) {

                  gallery = GalleryService.get($attr.target);

               }
            

            }


            $element.on('click', function () {

               console.log('this is a test.')
               getGallery();

               gallery.openFullScreen();

            });




         }
      }
   }
]);



angular
   .module('nivel')
   .directive('next', [ '$timeout', 'GalleryService', function ($timeout, GalleryService) {
  
      return {
         restrict: 'A',
         scope : true,

         link: function ($scope, $element, $attr) {

            var gallery = $scope.$parent;

            if($attr.target != undefined) {

               gallery = GalleryService.get($attr.target);

            } else {

               $scope.$on('gallery-instantiated', function(e) {

                  gallery = e.targetScope;

               });
            
            }

            var getGallery = function () {
               
               if($attr.target != undefined) {

                  gallery = GalleryService.get($attr.target);

               }
            

            }


            $element.on('click', function () {

               getGallery();

               gallery.next();

            });




         }
      }
   }
]);


angular
   .module('nivel')
   .directive('previous', [ '$timeout', 'GalleryService', function ($timeout, GalleryService) {
  
      return {
         restrict: 'A',
         scope : true,

         link: function ($scope, $element, $attr) {

            var gallery = $scope.$parent;

            if($attr.target != undefined) {

               gallery = GalleryService.get($attr.target);

            } else {

               $scope.$on('gallery-instantiated', function(e) {

                  gallery = e.targetScope;

               });
            
            }

            var getGallery = function () {
               
               if($attr.target != undefined) {

                  gallery = GalleryService.get($attr.target);

               }
            

            }


            $element.on('click', function () {

               getGallery();
               gallery.previous();

            });


         }
      }
   }
]);


angular
   .module('nivel')
   .directive('goto', [ '$timeout', 'GalleryService', function ($timeout, GalleryService) {
  
      return {
        restrict: 'AE',

        scope : true,

        link: function ($scope, $element, $attr) {

            var item = GalleryService.get($attr.target);

            $element.on('click', function () {

               console.log('go to ', $attr.target);

               item = GalleryService.get($attr.target);

               console.log(item);

               item.show();

            });

            console.log(item);

            if(item != undefined) {

               if(item.shown == true) {

                  $element.addClass('selected');

               }


               item.$on('shown', function (e) {

                  console.log('image changed');


                  $element.addClass('selected');
      


               });


               item.$on('hidden', function (e) {

                  $element.removeClass('selected');

               });

            
            } else {


               $scope.$on('gallery-instantiated', function(e) {

                  item = GalleryService.get($attr.target);                  

                  item.$on('shown', function (e) {

                     console.log('image changed');
                     $element.addClass('selected');
         
                  });


                  item.$on('hidden', function (e) {

                     $element.removeClass('selected');

                  });


               });


            }

            





        }

      }

   }]);
