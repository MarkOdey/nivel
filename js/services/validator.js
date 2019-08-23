angular
   .module('nivel')
   .service('Validator', [ 'Emitter', '$q', '$rootScope', 'File', '$http', function(Emitter, $q, $rootScope, File, $http) {


      var self = this;

      var forms = {};



      this.addInvalidation = function (submit, input) {



         var form;

         //We check if form is existant
         if(forms[submit.id] == undefined) {

            //Lets create a new form item.
            //
            
            form = new Emitter();
            form.submit= submit;

            form.register(["valid", "invalid"]);

            form.invalidations = [];

            forms[submit.id] = form;   

         } else {

            //Let fetch the form in the array.

            form = forms[submit.id];
         }


         form.invalidations[input.id] = input;

         check(form);

         return form;


      }

      this.removeInvalidation = function (submit, input) {



         var form;

         //We check if form is existant
         if(forms[submit.id] == undefined) {

           return;

         } 

         //Let fetch the form in the array.

         form = forms[submit.id];
         

         if(form != undefined) {

            delete form.invalidations[input.id];
         }

         check(form);

         return form;

      }


      var check = function (form) {

         if(Object.keys(form.invalidations).length != 0 ) {

            var invalidate = true;

            for(var i in form.invalidations) {

               if(form.invalidations[i].disabled != undefined && form.invalidations[i].disabled == true) {
                  invalidate = false;
               }

            }


            if(invalidate) {

               form.submit.disabled=true;

               form.emit('invalid');

            } else {

               form.submit.disabled=false;

               form.emit('valid');
            }


            return;

         }

         if(Object.keys(form.invalidations).length == 0 ) {

            form.submit.disabled=false;

            form.emit('valid');

            return;
         }
      }






   }]);


