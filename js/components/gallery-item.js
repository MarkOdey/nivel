angular
   .module('nivel')
   .directive('galleryItem', [ '$timeout', function ($timeout) {
  
      return {
        restrict: 'A',

        link: function ($scope, $element, $attr) {

            console.log($scope);

            console.log($attr);

            $scope.$on('gallery-fullscreen', function (data) {


              if(data.targetScope.fullscreen) {

                $element.append("<div class='caption'>"+$attr.caption+"</div>");

              } else {

                $element.find(".caption").remove();


              }

            })

            /*window.addEventListener("resize", function() {

            	$scope.$$childHead.layout = $scope.layout;

            	$scope.$$childHead.resize();

            	console.log($scope.$$childHead.resize);


            });
          */

        }
    }
}]);