/*
angular
   .module('nivel')
   .directive('archiveItem', function () {

        return {
            restrict: 'E',
            scope : {


            },
            link: function ($scope, $element, $attr) {

            }
        }
    });


angular
    .module('nivel')
    .service('Archive', function(){


        var self = this;

        self.items=[];

       self.addItem =  function(item){
            self.items.push(item);
        };


       

    });*/