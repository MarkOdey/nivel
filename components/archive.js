/*
angular
   .module('fonderieComponent')
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
    .module('fonderieComponent')
    .service('Archive', function(){


        var self = this;

        self.items=[];

       self.addItem =  function(item){
            self.items.push(item);
        };


       

    });*/