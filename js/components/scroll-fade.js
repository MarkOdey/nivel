

angular
.module('nivel')
.directive('scrollFade', [  function() {

	return {
	    restrict: 'AC',
	    scope : {

	      "animationin" : "@",
	      "animationout" : "@",
	      "from":"@",
	      "to":"@",
	      "visible":"@"


	    },

	    link: function ($scope, $element, $attr) {




	    	//console.log('nivel is updating');
	    	var shown = false;


	    	update();

	    	var debounce;
	    	var updating = false;
	    	
			var scrollEvent = window.document.addEventListener("scroll", function (e) {

				if(debounce != undefined) {

				//	clearTimeout(debounce);
				} else {

				}

			

				if(updating == false) {

					updating = true;

					debounce = setTimeout(function () {

						update();

						updating = false;

					}, 200);



				}


			});


			function update() {

				//console.log('at scroll');

				if($scope.visible != undefined) {

					//console.log('based on visible');

					var element;

					if($scope.visible == "parent") {

						element = $element.parent();
					} else {


						element = angular.element($scope.visible);
					}

					var isVisible = checkVisible(element[0]);

					if(isVisible) {

						//console.log('in bound');

						show();

					} else {

						//console.log('out bound');
						
						hide();
				
					}



					return;
				}

				if($scope.to != undefined && $scope.from != undefined) {

					var inBound = checkBound();
					if(inBound) {

						//console.log('in bound');

						show();

					} else {

						//console.log('out bound');
						
						hide();
				
					}


					return;
				}
			

			}

			function checkBound() {

				var doc = window.document;

				var top = window.pageYOffset ;

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

					return false;

				} else {

					return true;

				}


			}


			function checkVisible(elm) {

				if(elm == undefined) {

					console.log('element undefined');
					return;

				}

				var rect = elm.getBoundingClientRect();
				var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
				return !(rect.top + rect.height < 0 || rect.top - viewHeight >= 0);
			}


			$scope.$on('$destroy', function () {

				console.log('destroy')

				window.document.removeEventListener("scroll", scrollEvent);

			});


			function hide () {


				if(shown) {

					//console.log('hide');

					if($scope.animationin != undefined) {


						$element.removeClass($scope.animationin);

						$element.addClass('animated');

						$element.addClass($scope.animationout);


					} else {



						//$element[0].style.display = "none";
						//
						
						////s$element[0].style.visibility = "visible";
						
						$element[0].style.transition = "opacity 0.5s linear";


					}




					shown = false;

				}
				

			}

			function show () {

				$element[0].style.opacity = "1";

				if(!shown) {

					//console.log('show');

					if($scope.animationout != undefined) {

						$element.removeClass($scope.animationout);

						$element.addClass('animated');

						$element.addClass($scope.animationin);

					} else {


						$element[0].style.transition = "opacity 0.5s linear";

					}				

					//$element[0].style.display = "block";

					shown = true;

				}

			}

	    }

	}

}]);