angular
   .module('nivel')
   .directive('gallery', [ '$timeout', 'resizer', function ($timeout, resizer) {
  
      return {
        restrict: 'E',
        transclude : "true",

        scope : {

        },

        link: function ($scope, $element, $attr, _, transclude) {



            transclude($scope, function(clone) {
                
                $element.append(clone);
            
            });


            //The active gallery item;
            $scope.activeItem;

            var galleryItems = $element.find('[gallery-item]');

            var index = 0;

            var timer;
        
            var galleryLength = $element.find('[gallery-item]').length;


            if(galleryLength <= 1) {

                $element.find('previous')[0].style.display = "none";
                $element.find('next')[0].style.display = "none";
            }


            $element.find('previous').bind('click', function () {
                console.log('this is a test');

                previous();

            });

            $element.find('next').bind('click', function () {
                console.log('this is a test');

                next();

            });


            var next = function () {
                
                index +=1;

                index =  index%galleryItems.length;

                render();

            }


            var previous = function () {

                index -= 1;

                index = (index+galleryItems.length)%galleryItems.length;

                render();

            }



            var render = function () {

                galleryItems = $element.find('[gallery-item]');

                console.log(galleryItems);

                galleryItems.each(function( i ) {


                    if(index == i ) {

                        galleryItems[i].style.visibility = 'visible';
                        galleryItems[i].style.pointerEvents = 'auto';

                    } else {

                        galleryItems[i].style.visibility = 'hidden';
                        galleryItems[i].style.pointerEvents = 'none';

                    }

                });


            }

            $scope.layout = "fit";
            $scope.fullscreen = false;

            $element.addClass('windowed');

            $scope.setFullScreen = function (bool) {

                if(bool == true) {



                    $element.addClass('fullscreen');

                    $element.removeClass('windowed');


                    console.log('fullscreen');

                    $scope.layout = "normal";
                    $scope.fullscreen = true;


                    $element[0].style.zIndex = "100";
                    $element[0].style.position = "fixed";
                    $element[0].style.top = "0px";
                    $element[0].style.left = "0px";
                    $element[0].style.width = "100%";
                    $element[0].style.height = "100%";
                    $element[0].style.backgroundColor="#222";

                    resizer.reset();


                    window.dispatchEvent(new Event("resize"));



                } else {

                    console.log('not fullscreen');


                    $element.removeClass('fullscreen');

                    $element.addClass('windowed');

                    
                    $scope.layout = "fit";
                    $scope.fullscreen = false;

                    $element[0].style.zIndex = "";
                    $element[0].style.position = "absolute";
                    $element[0].style.top = "0px";
                    $element[0].style.left = "0px";
                    $element[0].style.width = "100%";
                    $element[0].style.height = "100%";
                    $element[0].style.backgroundColor="";


                    resizer.reset();

                    window.dispatchEvent(new Event("resize"));

                }

                $scope.$broadcast('gallery-fullscreen', $scope);


            }

            $scope.openFullScreen = function () {

                $scope.setFullScreen(true);

            }

            $scope.closeFullScreen = function () {

                $scope.setFullScreen(false);
            }



            render();

        }

    }

}]);