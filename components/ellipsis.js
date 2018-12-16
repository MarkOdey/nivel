
angular
   .module('fonderieComponent')
   .directive('ellipsis', ['resizer', function (resizer) {

      return {
        restrict: 'A',
        scope : {

          height : "@"
        },
   
        link: function ($scope, $element, $attr) {

            $element.addClass('fadeIn');


            if($scope.height==undefined) {

                $scope.height = Number($element[0].offsetHeight);

            }

           // $element[0].style.height = $scope.height+"px";
           // $element[0].style.position = "relative";

            var reset = function () {

                for(var i =0;  i<$element[0].childNodes.length; i++) {

                    var childElement = $element[0].childNodes[i];

                    if(childElement.style == undefined) {
                        continue;
                    }
                  
                    childElement.style.display = "";

                }

            }

            reset();

            var getComputedWidth = function (element) {

                var style = element.currentStyle || window.getComputedStyle(element),
                width = element.offsetWidth,
                margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight),
                padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
               
                return width + (margin);

            }

            var getComputedHeight = function (element) {


                var style = element.currentStyle || window.getComputedStyle(element),
                height = element.offsetHeight, // or use style.width
                margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom),
                padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
           
                return height + (margin);


            }


            var resize = function (callback) {


                requestAnimationFrame(function() {


                    //console.log('resizing view');
                    reset();

                    //Loop through children and evaluate height on containter;
                    for(var i =$element[0].childNodes.length-1;  i>0; --i) {

                        var childElement = $element[0].childNodes[i];

                        if(childElement.style == undefined || childElement.tagName == "OBJECT") {

                            continue;
                        }

                        childElement.style.display = "";

                    }
                    
                    //Loop through children and evaluate height on containter;
                    for(var i =$element[0].childNodes.length-1;  i>=0; --i) {

                        var childElement = $element[0].childNodes[i];

                        if(childElement.style == undefined || childElement.tagName == "OBJECT") {

                            continue;
                        }

                        var computedHeight = getComputedHeight($element[0]);

                        if(Number($scope.height) < computedHeight) {

                            childElement.style.display = "none";

                        } else {

                            childElement.style.display = "";

                        }


                    }

                    
                    if(typeof callback == 'function'){

                        callback();

                    };

                })

            }


            resize();

            resizer.addEventListener('resize', function (callback) {

                resize(callback);

            }, $element);

            /*
            
            resizer.addEventListener('scroll', function(e) {
            

                console.log('firing');
                resize();
            });
            */
      
        }
	}
}]);