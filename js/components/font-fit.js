
angular
   .module('nivel')
   .directive('fontFit', [ 'resizer', function(resizer) {

      return {
        restrict: 'AC',
        scope : {

          minsize : "@",
          maxsize : "@" ,
          breakevery : "@",
          step:"@"
        },
   
        link: function ($scope, $element, $attr) {

            if($scope.minsize == undefined) {
                $scope.minsize = 36;
            }

            if($scope.maxsize == undefined) {
                $scope.maxsize = 80;
            }

            if($scope.step == undefined) {

                $scope.step = 3;
            }


            var breakHtml = function (str, every) {

                console.log(str);
                var text = "";

                for (var i = 0, charsLength = str.length; i < charsLength; i += every) {
                    var chunk = str.substring(i, i + every);
                    text += chunk;
                    text += "<br/>";

                }


                return text;
            }

            if($scope.breakevery !=undefined){


                console.log($scope.breakevery);
                console.log($element.html());

                var html=breakHtml($element.html(), 2);

                $element.html(html);

            }

            var parent = $element[0].parentNode;

            var fadeIn = false;

            // With default options (will use the object-based approach).
            // The object-based approach is deprecated, and will be removed in v2.
            /*var erd = elementResizeDetectorMaker();

            erd.listenTo(parent, function(element) {
                
                fadeIn = false;
                resize();

            });*/

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
           
                return height;


            }
    
            var resize = function (callback) {


                $element.addClass('fadeOut');
                $element.removeClass('fadeIn');


                requestAnimationFrame(function() {

                    var font = $scope.maxsize + "px";

                    var min = Number($scope.minsize);
                    var max = Number($scope.maxsize);

                    $element[0].style.fontSize = font;

                    $element[0].style.display = "inline";

                    var size = max;

                    var cycle = Number($scope.step);

                    for(var i = 0; i < cycle; ++i) {

                        console.log(cycle);

                        size = Math.floor(size);

                        font = size + "px";

                        $element[0].style.fontSize = font;

                        var parentWidth = getComputedWidth(parent);
                        var parentHeight = getComputedHeight(parent);

                        var width = getComputedWidth($element[0]);
                        var height = getComputedHeight($element[0]);
                        console.log(parentHeight, height);

                        if(parentHeight > height && parentWidth > width) {

                            
                           // console.log('this fires');
                            //size += Math.abs(max-size)/cycle;

                        } else {

                            console.log('doest this fires');

                            size -=  Math.abs(max-min)/cycle;



                        }



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


            resize();

            resizer.addEventListener('resize', function (callback) {

                resize(callback);

            }, $element);

            

        }
	}
}]);