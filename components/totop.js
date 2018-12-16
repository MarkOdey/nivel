
angular
   .module('fonderieComponent')
   .directive('toTop', ['resizer', function (resizer) {

      return {
        restrict: 'A',
        scope : {

        },
   
        link: function ($scope, $element, $attr) {

            var render = function  () {

                var top  = window.pageYOffset || document.documentElement.scrollTop;

                if(top < 200) {

                    $element[0].style.display = "none";
                } else {
                     $element[0].style.display = "block";
                }
            }

            resizer.addEventListener('scroll', function (callback) {


                render();

                callback();


            });

            $element.on('click', function() {

                window.scrollTo(0, 0);


            });
      
        }
	}
}]);