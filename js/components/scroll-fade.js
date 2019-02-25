angular
.module('nivel')
.directive('scrollFade', [  function() {

	return {
	    restrict: 'AC',
	    scope : {

	      "animation" : "@",
	      "from":"@",
	      "to":"@"


	    },

	    link: function ($scope, $element, $attr) {


	    	console.log('animation');

	    	var shown = false;



			var scrollEvent = window.document.addEventListener("scroll", function (e) {

				var doc = window.document;

				var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

				if($scope.from == undefined) {

					$scope.from = 0;
				}

				//console.log('on scroll');
				//console.log(top);

				if(Number.isNaN(top)) {

					return;
				}

				//console.log($scope.from);

				//console.log(Number($scope.from));

				if(Number($scope.to) < Number(top) ||
				   Number($scope.from) > Number(top)) {

					if(shown) {

						shown = false;

						//$element[0].style.display = "none";
						//
						
						//s$element[0].style.visibility = "visible";
						$element[0].style.opacity = "0";
						$element[0].style.transition = "opacity 0.5s linear";

						// visibility: visible;
						//  opacity: 1;
						//  transition: opacity 2s linear;


					}

					//console.log('fadeout');

				} else {

					if(!shown) {

						shown = true;

						//$element[0].style.display = "block";

						
						//$element[0].style.visibility = "hidden";
						$element[0].style.opacity = "1";
						$element[0].style.transition = "opacity 0.5s linear";

						//visibility: hidden;
  						//opacity: 0;
  						//transition: visibility 0s 2s, opacity 2s linear;

						
					}

					//console.log('fadeins');

				}



			});


			$scope.$on('$destroy', function () {

				window.document.removeEventListener("scroll", scrollEvent);

			});



	    }

	}

}]);