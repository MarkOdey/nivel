console.log('this should fire');

angular
   .module('nivel')
   .directive('dropdownToggler', [ function () {

      return {
         restrict: 'A',
         transclude:true,
         scope : {

            target : "@",
            value : "@"

         },
         templateUrl:"js/partials/dropdown-toggler.html",

         link: function ($scope, $element, $attr) {

            console.log('dropdown toggler')

            $element[0].style.display="block";

            $scope.showDropDown = false;

            $scope.openDropdown = function () {

               console.log('dropdown opened')

               if($scope.showDropDown == false) {
                  
                  $scope.showDropDown = true;

               } else {

                  $scope.showDropDown = false;

               }


            }

            $element.find('[drop-option]').on('click', function(e) {


               $scope.showDropDown = false;

               var value = e.target.getAttribute('value');

               var target = $scope.target;

               console.log(value);

               $scope.value = value;

               console.log($scope.target);

               var element = $("#"+$scope.target)[0];


               element.setAttribute('value', value);


               // Create a new 'change' event
               var event = new Event('change');

               // Dispatch it.
               element.dispatchEvent(event);



            });

            window.document.addEventListener('click', function(e) {

               if(isDescendant($element[0], e.target) == false) {

                  $scope.showDropDown = false;
                  $scope.$apply();
               }

            });


            function isDescendant(parent, child) {
               var node = child.parentNode;
               while (node != null) {
                  if (node == parent) {
                     return true;
                  }
               
                  node = node.parentNode;
               }
               
               return false;
            }



            
         }

      }


   }]);

