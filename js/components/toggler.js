

angular
   .module('nivel')
   .directive('toggler', [ function () {

      return {
         restrict: 'A',


         link: function ($scope, $element, $attr) {



            if($attr.if == undefined || $attr.if == "" || $attr.target == undefined || $attr.target == "") {

               return;

            }


            console.log($attr);

            var targets = [];

            //Breaking the target for each elements
            if($attr.target.indexOf("||") != -1) {

               

               targets = $attr.target.split("||");


            } else {


               targets.push($attr.target);

            }


            $element.on('change', function () {

               check();


            });


            var expectedValue = $attr.if;

            var check = function () {

               console.log('checking');
               if(expectedValue == $element[0].value ) {

                  show();

               } else {
                  hide();
               }

            }


            var show = function () {


               for(var i in targets) {

                  var id = targets[i];

                  $("#"+id+$attr.salt).show();


               }

            }



            var hide = function () {


               for(var i in targets) {

                  var id = targets[i];

                  $("#"+id+$attr.salt).hide();

               }

            }

            //Initial check pass.

            check();


         }

      }
   }
]);
