
angular
   .module('nivel')
   .directive('framer', [ 'resizer', function (resizer) {

      return {
        restrict: 'E',
        scope : {
            cropx:'@',
            cropy:'@',
            cropwidth:'@',
            cropheight:'@',
            width:'@',
            height:'@',
            layout:'<',
            centerx:'@',
            centery:'@',
            zoom:"@",

        },
        link: function ($scope, $element, $attr) {

            var image;


            $scope.cropx = Number($scope.cropx);
            $scope.cropy = Number($scope.cropy);

            $scope.cropwidth = Number($scope.cropwidth);
            $scope.cropheight = Number($scope.cropheight);

            $scope.width = Number($scope.width);
            $scope.height = Number($scope.height);

            var elementStyle = $element[0].style;

            var parent = $element.parent();

            console.log(parent[0]);

            elementStyle.display = 'block';
            elementStyle.position = 'absolute';
            elementStyle.left = '0px';
            elementStyle.top ='0px';
            elementStyle.width = '100%';
            elementStyle.height = '100%';



            if($scope.width == undefined) {

                $scope.width = 100;
            }


            if($scope.height == undefined) {

                $scope.height = 100;
            }

            if($scope.cropx == undefined) {

                $scope.cropx = 50;
            }

            if($scope.cropy == undefined) {

                $scope.cropy = 50;
                
            }


            if($scope.centerx == undefined) {

                $scope.centerx = 50;
            }

            if($scope.centery == undefined) {

                $scope.centery = 50;
                
            }



            if($scope.zoom == undefined) {

                $scope.zoom = 1;
            }else {

                $scope.zoom = Number($scope.zoom);
            }

            elementStyle.overflow = 'hidden';


            if($scope.layout == undefined) {

                $scope.layout = "centered";
            }


            // With default options (will use the object-based approach).
            // The object-based approach is deprecated, and will be removed in v2.
            // var erd = elementResizeDetectorMaker();

            // var resized=false;

            /* erd.listenTo($element[0], function(element) {

                    resized = false;
                    resize();



                });
            */

            resizer.addEventListener('resize', function (callback) {

                resize(callback);

            }, $element);

            $scope.$watch('layout', function () {

                console.log($scope.layout);

                resized = false;
                resize();

            });
           
            var imgDom = $element.find('img');


            imgDom.on('load', function () {

                image = this;

                resize();

            });


            

            var resize =  function (callback) {


                $element.addClass('fadeOut');
                $element.removeClass('fadeIn');



                requestAnimationFrame(function() {


                    if($scope.layout == "normal") {

                        computeNormalLayout();

                    } else if($scope.layout == "fit") {

                        computeFitLayout();

                    } else if($scope.layout == "centered") {

                        computeCenteredLayout();
                    }
                    

                    if(typeof callback == 'function'){

                        callback();

                    };


                    window.setTimeout(function () {

                            
                        $element.addClass('fadeIn');
                        $element.removeClass('fadeOut');


                    }, 200);


                });



            }

            $scope.resize = resize;

            resize();

            var computeCenteredLayout = function () {


                if(image == undefined) {
                    
                    imgDom = $element.find('img');
                    image = imgDom[0];

                }



                //Gets image ratio
                var originW = image.naturalWidth;
                var originH = image.naturalHeight;

                //Gets parent element width;
                var parentW = $element[0].offsetWidth;
                var parentH = $element[0].offsetHeight;


                var imageRatio = originH/originW;

                var parentRatio = parentH/parentW;

                var imageW;
                var imageH;


                //Width will be 100%;
                if(imageRatio > parentRatio) {

                    imageW = parentW*$scope.zoom;
                    imageH = (originH/originW)*imageW;

                } else {

                    imageH = parentH*$scope.zoom;
                    imageW = (originW/originH)*imageH;

                }


                var leftPos = (parentW*0.5)-(Number($scope.centerx)/100)*imageW;
                var topPos  = (parentH*0.5)-(Number($scope.centery)/100)*imageH;


                image.style.position = "absolute";
                image.style.display = "block";
                image.style.left = leftPos+"px";
                image.style.top = topPos+"px";
                image.style.width = imageW+"px";
                image.style.height = imageH+"px";




                console.log("centered image");

            }



            var computeNormalLayout = function () {


                if(image == undefined) {
                    
                    imgDom = $element.find('img');
                    image = imgDom[0];

                }

                var parentW = $element[0].offsetWidth;
                var parentH = $element[0].offsetHeight;

                if(parentW/parentH > image.width/image.height) {

                    image.style.height = "100%";
                    image.style.width = "auto";
                    image.style.position = "absolute";
                    image.style.margin = "auto";
                    image.style.display = "block";
                    image.style.top = "0px";
                    image.style.left = parentW/2-image.width/2+"px";

                } else {

                    image.style.height = "auto";
                    image.style.width = "100%";
                    image.style.position = "absolute";
                    image.style.margin = "auto";
                    image.style.display = "block";
                    image.style.left = "0px";
                    image.style.top = parentH/2-image.height/2 + "px";

                }





            }


            var computeFitLayout = function () {


                if(image == undefined) {
                    
                    imgDom = $element.find('img');
                    image = imgDom[0];

                }

                var RCx = Number($scope.cropx) + Number($scope.cropwidth)/2;
                var RCy =  Number($scope.cropy) + Number($scope.cropheight)/2;

                var RCxPct =  RCx/$scope.width;
                var RCyPct = RCy/$scope.height;

                //Gets image ratio
                var imageW = image.naturalWidth;
                var imageH = image.naturalHeight;

                //Gets parent element width;
                var parentW = $element[0].offsetWidth;
                var parentH = $element[0].offsetHeight;


                var imageRatio = imageH/imageW;

                var parentRatio = parentH/parentW;

            
                image.style.position = "absolute";

                //Width will be 100%;
                if(imageRatio > parentRatio) {

                    var imageWidth = parentW;

                    image.style.width = imageWidth+"px";
                    image.style.height = "auto";

                    var top = RCyPct * image.offsetHeight - parentH/2; 

                    if(top < 0) {

                        top = 0;
                    }

                    if(image.offsetHeight - top < parentH) {

                        top += (image.offsetHeight - top) - parentH;

                    }

                    image.style.top = -top + "px";
                    image.style.left = "0px";

                } else {

                    var imageHeight = parentH;

                    image.style.height = imageHeight + "px";
                    image.style.width = "auto";

                    var left = RCxPct * image.offsetWidth - parentW/2;

                    if(left < 0){

                        left = 0;

                    }

                    if(image.offsetWidth - left < parentW) {

                        left += (image.offsetWidth - left) - parentW;
                    }

                    image.style.top = "0px";
                    image.style.left = -left + "px";

                }
            
            }

            /* resizer.addEventListener('scroll', function(e) {
                
                console.log('firing');
                resize();
            });*/
      
        }
  };
}]);