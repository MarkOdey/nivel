

angular
   .module('nivel')
   .directive('lang', [ 'language', function (language) {

      return {
        restrict: 'A',

        link: function ($scope, $element, $attr) {


            $scope.html = "";
            $scope.lang;

            if($attr.lang != undefined) {

                $scope.lang = $attr.lang;

            }


            $scope.html = $element.html();

            var render = function () {

                if(language.lang == $scope.lang) {

                    var children = $element.children();

                    if(children.length == 0) {

                        $element.append($scope.html);

                    }

                } else {

                    console.log('destroying');

                    $scope.$destroy();
                    $element.empty();

                }
            }

            render();




            console.log($attr);

            console.log($element);

        }

    }
}]);


angular
   .module('nivel')
   .directive('selectLang', [ 'language', function (language) {

      return {
        restrict: 'A',


        link: function ($scope, $element, $attr) {

            if($attr.selectLang != undefined) {

                $element.on('click', function () {

                    language.set($attr.selectLang);

                });
            }


        }

    }
}]);