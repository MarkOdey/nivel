
angular
.module('nivel')
.directive('scrollSnap', [  function() {

  return {
    restrict: 'AC',
    scope : {

      "from" : "@",
      "to" : "@"
    },

    link: function ($scope, $element, $attr) {

      

      window.document.addEventListener("touchmove", function(e){


        e.preventDefault();



      });



      window.document.addEventListener("scroll", function (e) {


        if(window.innerWidth > 800) {

          return;
        }


        if($scope.from == undefined) {

          return;

        } 

        if($scope.to == undefined) {

          return;

        }

        $scope.from = Number($scope.from);
        $scope.to = Number($scope.to);

        //console.log($scope.from);


        if($scope.from < window.scrollY  && $scope.to > window.scrollY) {

          $element[0].style.position = "fixed";
          $element[0].style.zIndex = "1000000";
          $element[0].style.top = "0px";

        } else {

          $element[0].removeAttribute("style");

     

        }


      });




      $scope.$watch("from", function() {

        if($scope.from != undefined) {

          console.log($scope.from);

        }

      });

      $scope.$watch("to", function () {

        if($scope.to != undefined) {

          console.log($scope.to);

        }

      });

    }

  }
}]);
