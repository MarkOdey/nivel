

angular
   .module('nivel')
   .service('GalleryService', function () {

      var items = [];


      var index = 0;


      this.next = function () {
                
         index += 1;

         index = index%galleryItems.length;

         render();

      }


      var previous = function () {

         index -= 1;

         index = (index+galleryItems.length)%galleryItems.length;

         render();

      }

      this.add = function  (payload) {

         items.push(payload);

      }

      this.remove = function () {

         delete items[key];
      }

      this.get = function (itemId) {


         for(var i in items) {

            if(items[i].id == itemId) {

               return items[i];
            }

         }

         return items[itemId];

      }

   });

