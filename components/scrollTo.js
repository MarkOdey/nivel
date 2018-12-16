angular
.module('fonderieComponent')
.directive('scrollTo', [  function() {

	return {
	    restrict: 'AC',
	    scope : {

	      "from" : "@",
	      "to" : "@"
	    },

	    link: function ($scope, $element, $attr) {



			window.document.addEventListener("touchmove", function(e){



			});



			window.document.addEventListener("scroll", function (e) {


			});


			

		}

	}


}]);
