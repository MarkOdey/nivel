angular
    .module('nivel')
    .directive('errorRequired', [ '$timeout', '$http', 'CrudService', 'Validator', function ($timeout, $http, CrudService, Validator) {
  
    return {
        restrict: 'A',

        scope : {

            'active' :"@",
            'target' :"@"
        },

        link: function ($scope, $element, $attr) {

            if(typeof $scope.active ==  "string") {

                $scope.active = Boolean($scope.active);
            }


            var input = $("#"+$scope.target)[0];

            if(input == undefined) {
                console.log('input is not defined');
                return;

            }

            $scope.valid = false;

            var isValid = function () {

                var submit = $element.closest("form").find('[type=submit]')[0];

                if(submit != undefined) {

                    if(submit.id == undefined || submit.id == "") {

                      submit.id = Math.round(Math.random()*100000)+"submit";  
                    }

                    Validator.removeInvalidation(submit, input);

                }

                //submit.prop('disabled', false);
                $element.hide();

                $scope.valid = true;

            }

            var isInValid= function () {

                var submit = $element.closest("form").find('[type=submit]')[0];

                if(submit != undefined) {

                    if(submit.id == undefined || submit.id == "") {

                      submit.id = Math.round(Math.random()*100000)+"submit";  
                    }

                    Validator.addInvalidation(submit, input);

                }

                $element.show();

                $scope.valid = false;
            }

            var check = function () {

                console.log(input.value);

                if(input.value == undefined || input.value == "") {

                    isInValid();

                } else {

                    isValid();
                }

            }

            if($scope.active ==  true) {

                check();
               // $element.closest("form").find('[type=submit]').prop('disabled', true);
               
            }


            if(input != undefined) {

                input.addEventListener('change', function (e) {

                    console.log(input.value);

                   check();

                });


            }

        }

    }

}]);