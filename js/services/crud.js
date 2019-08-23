angular
   .module('nivel')
   .service('CrudService', [ 'Emitter', '$q', '$rootScope', 'File', '$http', function(Emitter, $q, $rootScope, File, $http) {

      Emitter.apply(this, arguments);

      var self = this;

      self.register(['updating', 'updated']);

      var updating = false;


      window.addEventListener("beforeunload", function(e) {

         if(updating == true) {

            (e || window.event).returnValue = "Something is currently updating. Are you sure you want to leave this page?";
         }

      });


      self.updating = function () {

         updating = true;

      }

      self.updated = function () {

         updating = false;

      }


   }]);