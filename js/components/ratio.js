/**
 * Sets the size of the element according to a target ratio.
 * 
 */
angular
   .module('nivel')
   .directive('ratio', [ 'resizer', function (resizer) {

        return {
            restrict: 'A',
            scope : {
                width:'@',
                height:'@',
                layout:"@"
            },
            link: function ($scope, $element, $attr) {

                if($scope.layout == undefined) {

                    $scope.layout = "width"
                }


                var resize =  function(callback) {

                    console.log("ratio")

                    if($scope.layout == "width") {


                        var width = 4;
                        var height = 3;

                        if($scope.width != undefined) {

                            width = Number($scope.width);
                        }

                        if($scope.height != undefined) {

                            height = Number($scope.height);

                        }

                        $element[0].style.position="relative";
                        $element[0].style.width="100%";


                        $element[0].style.height= (height/width)*$element.width() + "px";


                        if(callback != undefined) {
                            callback();

                        }

                    } 
                }


                resizer.addEventListener('resize', function (callback) {

                    resize(callback);

                }, $element[0]);


                resize();

            }
        }

    }]);
