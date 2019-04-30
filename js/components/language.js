

angular
   .module('nivel')
   .directive('lang', [ 'Language', '$compile', function (Language, $compile) {

      return {
        restrict: 'A',
        scope : {

        },

        link: function ($scope, $element, $attr) {


            var html = "";
            var lang;

            if($attr.lang != undefined) {

                lang = $attr.lang;

            }


            html = $element.html();

            var render = function () {

                if(Language.lang == lang) {

                    var children = $element.children();

                    if(children.length == 0) {

                        $element.append(html);
                        var scope = $scope.$new(true);
                        var compiled = $compile($element[0])(scope);

                    }

                } else {

                    console.log('destroying');
                    $element.empty();
                    $scope.$destroy();


                }
            }

            render();



            Language.on('changed', function (lang) {

                console.log('rerendering');

                render();
            });


            console.log($attr);

            console.log($element);

        }

    }
}]);


angular
   .module('nivel')
   .directive('selectLang', [ 'Language', function (Language) {

      return {
        restrict: 'A',


        link: function ($scope, $element, $attr) {

            if($attr.selectLang != undefined) {

                $element.on('click', function () {

                    Language.set($attr.selectLang);

                });
            }


        }

    }
}]);