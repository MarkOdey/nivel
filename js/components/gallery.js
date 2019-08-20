angular
   .module('nivel')
   .directive('gallery', [ '$timeout', 'resizer', 'GalleryService', function ($timeout, resizer, GalleryService) {
  
      return {
        restrict: 'E',
        transclude : "true",

        scope : {

            layout : "@",
            autoSlide : "@"



        },

        link: function ($scope, $element, $attr, _, transclude) {


            var scope = $scope;


            transclude($scope, function(clone) {
                
               $element.append(clone);

            });

            if($scope.autoSlide != undefined) {

               window.setInterval(function() {

                  next();

                  $scope.$apply();

               }, Number($scope.autoSlide));

            }


            if($attr.id == undefined) {

                $scope.id = "gallery"+Math.round(Math.random()*100000);
                

            } else {

                $scope.id = $attr.id;
            }


            $scope.items = [];

            $scope.$broadcast('gallery-instantiated', $scope);

            var index = 0;

            var timer;

            var positionGalleryItem =  function (item) {

               for(var i in $scope.items) {

                    if($scope.items[i].id != item.id) {


                        $scope.items[i].hide();

                    } else {
                        
                        //The current index of the item is i;

                        index = Number(i);

                        //Element index 
                        
                        var width = $element.width();


                    }

               }


               var slider = $element.find('[slider]');



                
               if($scope.layout == "slider") {

                  ////console.log($element.width());

                  slider[0].style.left= -index*$element.width() + "px";

               }


               if($scope.layout == "carrousel") {

                    var offsetLeft = 0;

                    var parentWidth = $element.width();

                    //We have the index of the active item;
                    
                    //We check the position of active item and determine if visible or not
                    var id = $scope.items[index].id;
                    var element = $element.find("#"+ id);

                    ////console.log(element[0].offsetLeft);
                    ////console.log($element[0].offsetLeft);


                    if(element[0].offsetLeft >= -1*slider[0].offsetLeft &&
                       element[0].offsetLeft + element.width() < parentWidth) {

                        ////console.log('item is visible');
                        

                    } else if(element[0].offsetLeft <= -1*slider[0].offsetLeft){

                        ////console.log('before');
                        slider[0].style.left = -(element[0].offsetLeft) + "px";

                    } else if(element[0].offsetLeft + element.width() > parentWidth) {
                        
                        ////console.log('after');
                        slider[0].style.left = slider.width()-(element.width()+element[0].offsetLeft) + "px";

                    }
                    
    
               }

            }
        
    
            $scope.$on('shown', function (e) {


               var item = e.targetScope;


               positionGalleryItem(item);

            })




            var next = function () {
                
                index += 1;

                index = index%$scope.items.length;

                render();

            }

            $scope.next = next;

            var previous = function () {

                index -= 1;

                index = (index+$scope.items.length)%$scope.items.length;

                render();

            }

            $scope.previous = previous;

            var render = function () {

               if(scope.layout == "slider" || scope.layout == "carrousel") {

                  var slider = $element.find('[slider]');

                  //We check if slider element exists.
                  if(slider.length == 0) {

                     slider=$('<div slider style="position:absolute;width:100%;height:100%;"></div>');

                     $element.append(slider);

                     console.log('slider doesnt exist');

                     //Adding elements in slider
                     for(var i in scope.items) {

                        var id = scope.items[i].id;

                        var element =  $element.find("#"+id);

                        slider.append(element);

                     }   

                        

                  }

                  ////console.log('slider');
                  ////console.log($element.width());
                  ////console.log($element.height());



                  ////console.log("rendering!!");

                  var offsetLeft = 0;

                  for(var i in scope.items) {

                     var id = scope.items[i].id;

                     var element =  $element.find("#"+id);



                     element[0].style.left = offsetLeft+"px";

                     offsetLeft += element.width();

                  }   

               } 

               for(var i in scope.items) {

                    if(index == i) {

                        scope.items[i].show();

                    } else {

                        scope.items[i].hide();

                    }
               
               }

               console.log($element.width());

               if(scope.layout == "slider") {

                  var slider = $element.find('[slider]');

                  slider[0].style.left= -index*$element.width() + "px";

               }


            }



            if($scope.layout == undefined) {
                $scope.layout = "fit";
            }


            $scope.fullscreen = false;

            $element.addClass('windowed');

            $scope.setFullScreen = function (bool) {

               if(bool == true) {



                  $element.addClass('fullscreen');

                  $element.removeClass('windowed');


                  ////console.log('fullscreen');

                  //$scope.layout = "normal";
                  $scope.fullscreen = true;


                  $element[0].style.zIndex = "100";
                  $element[0].style.position = "fixed";
                  $element[0].style.top = "0px";
                  $element[0].style.left = "0px";
                  $element[0].style.width = "100%";
                  $element[0].style.height = "100%";


                  resizer.reset();


                  window.dispatchEvent(new Event("resize"));



               } else {

                  //console.log('not fullscreen');


                  $element.removeClass('fullscreen');

                  $element.addClass('windowed');


                  //$scope.layout = "fit";
                  $scope.fullscreen = false;

                  $element[0].style.zIndex = "";
                  $element[0].style.position = "absolute";
                  $element[0].style.top = "0px";
                  $element[0].style.left = "0px";
                  $element[0].style.width = "100%";
                  $element[0].style.height = "100%";


                  resizer.reset();

                  window.dispatchEvent(new Event("resize"));

               }

               render();

               positionGalleryItem($scope.items[index]);

               $scope.$broadcast('gallery-fullscreen', $scope);


            }

            $scope.openFullScreen = function () {

                $scope.setFullScreen(true);

            }

            $scope.closeFullScreen = function () {

                $scope.setFullScreen(false);
            }


            //Adding gallery add scope.
            GalleryService.add($scope);

            render();

        }

    }

}]);