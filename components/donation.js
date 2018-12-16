angular
   .module('fonderieComponent')
   .directive('donation', [ '$timeout', '$http', function ($timeout, $http) {
  
	    return {
			restrict: 'E',
			templateUrl : 'js/partials/donation.html' ,
			scope : {

				buttontext : "@",
				title : "@"

			},

			link: function ($scope, $element, $attr) {

				console.log($scope.buttontext);
				console.log($scope.title);

				$scope.update = function () {

					console.log($scope.amount);
				}

				$scope.send = function () {

					console.log($element.find('form')[0]);

					$element.find('form')[0].submit();
					

					console.log('submit');
				}
			}

	    }

    }]);


// Numeric only control handler
/*jQuery.fn.ForceNumericOnly =
function()
{
    return this.each(function()
    {
        $(this).keydown(function(e)
        {
            var key = e.charCode || e.keyCode || 0;
            // allow backspace, tab, delete, arrows, numbers and keypad numbers ONLY
            return (
                key == 8 || 
                key == 9 ||
                key == 46 ||
                (key >= 37 && key <= 40) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105));
        });
    });
};

*/

