
angular
   .module('fonderieComponent')
   .service('AnchorService', [ function () {

        this.anchors =  {};

        this.getAnchors = function() {
            
            return this.anchors;

        }

        this.remove = function(anchor) {

            delete this.anchors[anchor.id];

        }

        this.add = function(anchor) {

            this.anchors[anchor.id] = anchor;
        }

        
    }]);


angular
   .module('fonderieComponent')
   .directive('anchor', [ 'AnchorService' , function (AnchorService) {

        return {
            restrict: 'E',
            scope : {

                id : "@"
            },
            link: function ($scope, $element, $attr) {



                AnchorService.add($scope);


            }
        }
    }]);


angular
   .module('fonderieComponent')
   .directive('anchorMenu', [ 'AnchorService', function (AnchorService) {

        return {
            restrict: 'E',
            templateUrl:"js/partials/anchor-menu.html",
            scope : {


            },
            link: function ($scope, $element, $attr) {

                $scope.baseurl = location.protocol + '//' + location.host + location.pathname;

                $scope.anchors = AnchorService.getAnchors();


            }
        }
    }]);


