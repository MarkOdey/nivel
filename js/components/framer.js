
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
            layout:'@',
            centerx:'@',
            centery:'@',
            zoom:"@",

        },
        link: function ($scope, $element, $attr) {

            var elements;


            $scope.cropx = Number($scope.cropx);
            $scope.cropy = Number($scope.cropy);

            $scope.cropwidth = Number($scope.cropwidth);
            $scope.cropheight = Number($scope.cropheight);



            $scope.width = Number($scope.width);
            $scope.height = Number($scope.height);

            var elementStyle = $element[0].style;

            var parent = $element.parent();

            ////console.log(parent[0]);

            elementStyle.display = 'block';
            elementStyle.position = 'absolute';
            elementStyle.left = '0px';
            elementStyle.top ='0px';
            elementStyle.width = '100%';
            elementStyle.height = '100%';

           // elementStyle.zIndex = "-1";



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

            }, $element[0]);

            $scope.$watch('layout', function () {

                //console.log($scope.layout);

                resized = false;
                resize();

            });
           
            var elements = $element.children();


            elements.on('load', function () {

                resize();

            });

            elements.on('loadedmetadata', function () {

                resize();
            })

            

            var resize =  function (callback) {


                $element.addClass('fadeOut');
                $element.removeClass('fadeIn');

                //console.log(elements);

                requestAnimationFrame(function() {

                    try {

                        elements.each(function () {

                            var element = this;

                            if($scope.layout == "normal") {

                                computeNormalLayout(element);

                            } else if($scope.layout == "fit") {

                                computeFitLayout(element);

                            } else if($scope.layout == "centered") {

                                computeCenteredLayout(element);
                            } else if ($scope.layout == "right") {

                                computeRightLayout(element);
                            }
                            
                            if(typeof callback == 'function'){

                                callback();

                            };

                            window.setTimeout(function () {
                                    
                                $element.addClass('fadeIn');
                                $element.removeClass('fadeOut');

                            }, 200);

                        });


                    } catch (e) {


                        throw e;

                    }





                });



            }

            $scope.resize = resize;

            resize();


            var computed = false;


            var interval = setInterval(function() {

                if($element[0].offsetParent === null || computed == true ) {

                } else {
                    console.log('is visible')

                    resize();
                    computed = true;
                }

            }, 500);

            var computeCenteredLayout = function (element) {

                var originW, originH;

                if(element.naturalWidth != undefined) {

                    //Gets element ratio
                    originW = element.naturalWidth;
                    originH = element.naturalHeight;

                }

                if(element.videoWidth != undefined) {

                    //Gets element ratio
                    originW = element.videoWidth;
                    originH = element.videoHeight;


                }


                //Gets parent element width;
                var parentW = $element[0].offsetWidth;
                var parentH = $element[0].offsetHeight;

                console.log(parentW, parentH)


                var elementRatio = originH/originW;

                var parentRatio = parentH/parentW;

                var elementW;
                var elementH;


                //Width will be 100%;
                if(elementRatio > parentRatio) {

                    elementW = parentW*$scope.zoom;
                    elementH = (originH/originW)*elementW;

                } else {

                    elementH = parentH*$scope.zoom;
                    elementW = (originW/originH)*elementH;

                }


                var leftPos = (parentW*0.5)-(Number($scope.centerx)/100)*elementW;
                var topPos  = (parentH*0.5)-(Number($scope.centery)/100)*elementH;


                element.style.position = "absolute";
                element.style.display = "block";
                element.style.left = leftPos+"px";
                element.style.top = topPos+"px";
                element.style.width = elementW+"px";
                element.style.height = elementH+"px";

            }

            var computeRightLayout = function (element) {

                element.style.position = "absolute"
                element.style.right ="0";
                element.style.top = "0";
                element.style.height= "100%";
            }


            var computeNormalLayout = function (element) {


                var parentW = $element[0].offsetWidth;
                var parentH = $element[0].offsetHeight;

                console.log(element.height);
                console.log(element.width)

                if(parentW/parentH > element.width/element.height) {

                    element.style.height = "100%";
                    element.style.width = "auto";
                    element.style.position = "absolute";
                    element.style.margin = "auto";
                    element.style.display = "block";
                    element.style.top = "0px";
                    element.style.left = parentW/2-element.width/2+"px";

                } else {

                    element.style.height = "auto";
                    element.style.width = "100%";
                    element.style.position = "absolute";
                    element.style.margin = "auto";
                    element.style.display = "block";
                    element.style.left = "0px";
                    element.style.top = parentH/2-element.height/2 + "px";

                }


            }


            var computeFitLayout = function (element) {


                var RCx = Number($scope.cropx) + Number($scope.cropwidth)/2;
                var RCy =  Number($scope.cropy) + Number($scope.cropheight)/2;

                var RCxPct =  RCx/$scope.width;
                var RCyPct = RCy/$scope.height;


                if(element.naturalWidth != undefined) {

                    //Gets element ratio
                    var elementW = element.naturalWidth;
                    var elementH = element.naturalHeight;

                }

                if(element.videoWidth != undefined) {
                    
                    //Gets element ratio
                    var elementW = element.videoWidth;
                    var elementH = element.videoHeight;

                }


                //Gets parent element width;
                var parentW = $element[0].offsetWidth;
                var parentH = $element[0].offsetHeight;


                var elementRatio = elementH/elementW;

                var parentRatio = parentH/parentW;

            
                element.style.position = "absolute";

                //Width will be 100%;
                if(elementRatio > parentRatio) {

                    var elementWidth = parentW;

                    element.style.width = elementWidth+"px";
                    element.style.height = "auto";

                    var top = RCyPct * element.offsetHeight - parentH/2; 

                    if(top < 0) {

                        top = 0;
                    }

                    if(element.offsetHeight - top < parentH) {

                        top += (element.offsetHeight - top) - parentH;

                    }

                    element.style.top = -top + "px";
                    element.style.left = "0px";

                } else {

                    var elementHeight = parentH;

                    element.style.height = elementHeight + "px";
                    element.style.width = "auto";

                    var left = RCxPct * element.offsetWidth - parentW/2;

                    if(left < 0){

                        left = 0;

                    }

                    if(element.offsetWidth - left < parentW) {

                        left += (element.offsetWidth - left) - parentW;
                    }

                    element.style.top = "0px";
                    element.style.left = -left + "px";

                }
            
            }

            /* resizer.addEventListener('scroll', function(e) {
                
                //console.log('firing');
                resize();
            });*/
      
        }
  };
}]);