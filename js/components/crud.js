angular
    .module('nivel')
    .directive('crud', [ '$timeout', '$http', 'CrudService', function ($timeout, $http, CrudService) {
  
    return {
        restrict: 'A',

        scope : {

            'update' :"@"
        },

        link: function ($scope, $element, $attr) {

            console.log('crud');

            var timerReset;

            //We iterate for each input fields in the children.

            $element.find('input[type=number], [value], textarea').on('change', function (e) {

                var inputs = $element.find("input[type=number], input[value], textarea").toArray();

                var payload = {};

                //Parsing data to update in form. 

                for(var i in inputs) {

                    var input = inputs[i];

                    payload[input.name] =  input.value;
                }



                if($(e.currentTarget).parent().has(".crud-loader").length == 0) {

                    var loader = $('<div class="crud-loader spinner-border spinner-border-sm text-secondary" role="status"><span class="sr-only">Loading...</span></div>');

                    $(e.currentTarget).after(loader);
                }




                if(timerReset != undefined) {

                    window.clearTimeout(timerReset);
                }

                CrudService.updating();

                $element.find("input[type=submit]").prop('disabled',true);

                timerReset = window.setTimeout(function() {


                    //We send the payload to the server.
                    $http({

                        method:"POST",
                        url : $scope.update,
                        data : payload,
                        withCredentials : true

                    }).then(function (e) {

                        $element.find(".crud-loader").remove();
                        CrudService.updated();

                        $element.find("input[type=submit]").prop('disabled',false);


                    });


                }, 2000);



            });

        }

    }
}
]);
