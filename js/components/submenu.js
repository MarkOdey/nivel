angular
.module('nivel')
.directive('submenuToggle', [ 'SubmenuService', function(SubmenuService) {

	return {
	    restrict: 'E',
	    scope : {

            target:"@",
            event:"@"

	    },
	    link: function ($scope, $element, $attr) {


            console.log($attr.target)


            if($scope.event == undefined) {

                $scope.event = "click";
            }

            $element.on($scope.event, function(e) {

               // console.log($attr.target);

                var size = getWindowSize();

                var submenu = SubmenuService.get($scope.target);


                //We check if the button is desktop friendly if so we evaluate width of the window.
                if($attr.mobileonly == undefined || size.width > 860 ) {

                    submenu.show();

                }

                e.stopPropagation();

            });



            /**
             * Gets the window size cross browwser
             * @return {object} size The size of the window.
             */
            var getWindowSize = function() {

                var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

                var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

                return { "width" : width, "height" : height };

            }



            if($attr.mobileonly != undefined) {

                $element.addClass("mobileonly");

                

            }

			

		}

	}


}]);

angular
.module('nivel')
.directive('submenu', [  function() {

    return {

        restrict : 'E',
        scope : {

        },
        link: function ($scope, $element, $attr) {


            console.log($attr.mobilefriendly);

            if($attr.mobilefriendly != undefined) {

                window.document.addEventListener("scroll", function (e) {



                });


            }


            /**
             * Switching the menu according to window size.
             */
            var toggleMobileMenu = function () {

                menuOpened = true;

                var headerHeight = $(".header").height();


                var size = getWindowSize();

                if(size.width < 860) {

                    var menu = $(".menu1 > ul");

                    if(menu.length != 0) {

                        menu.detach();

                        console.log(menu);
                       
                        submenus[".menu1 > ul"] = menu;

                    }


                    $(".icon-menu").show();

                } else {

                    console.log(submenus);

                    var menu = submenus[".menu1 > ul"];

                    if(menu != undefined) {

                        menu.appendTo($(".menu1"));  

                    }


                    $(".icon-menu").hide();
                }


            }

            /**
             * Gets the window size cross browwser
             * @return {object} size The size of the window.
             */
            var getWindowSize = function() {

                var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

                var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

                return { "width" : width, "height" : height };

            }



        }

    }


}]);


angular
.module('nivel')
.directive('submenuItem', [ 'SubmenuService', function(SubmenuService) {

    return {

        restrict : 'E',
        scope : {

            id : "@"

        },
        link: function ($scope, $element, $attr) {

            /**
             * Gets the window size cross browwser
             * @return {object} size The size of the window.
             */
            var getWindowSize = function() {

                var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

                var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

                return { "width" : width, "height" : height };

            }


            /**
             * Switching the menu according to window size.
             */
            var toggleMobileMenu = function () {

                menuOpened = true;

                var headerHeight = $(".header").height();

                var size = getWindowSize();

                if(size.width > 860 || shown == true) {

                   
                    $element.show();

                } else {


                    $element.hide();
                }


            }

            if($attr.mobilefriendly != undefined) {

                $element.addClass("mobilefriendly");

                window.addEventListener("resize", function (e) {

                    toggleMobileMenu();

                });

                toggleMobileMenu();

            } else {

                $element.hide();

                var shown = false;

            }


            document.addEventListener('click', function(e) {

                if(shown == false) {

                    return;

                }

                //If is a submenu for mobile dont listen.
               /* if($attr.mobilefriendly != undefined) {
                    return;
                }*/


                var size = getWindowSize();

                if(size.width > 860 && $attr.mobilefriendly != undefined) {
     
                    return;
                }


                //If the target of the click is not inside the element;
                if($element[0].contains(e.target)) {

                    return;


                }


                $scope.hide();

            });




            $scope.show = function () {

                console.log('showing menu')
                
                shown = true;

                
                $element.show();


            }

            $scope.hide = function () {

                shown = false;

                $element.hide();
            }

            SubmenuService.add($scope);


        }

    }


}]);

angular
.module('nivel')
.directive('submenuClose', [ 'SubmenuService', function(SubmenuService) {

    return {

        restrict : 'A',
        scope : {

            target: "@"
        },

        link: function ($scope, $element, $attr) {




            $element.on('click', function() {


                var submenu = SubmenuService.get($scope.target);
                //$scope.hide();

                submenu.hide();
            
            });
        }

    }

}]);




angular
.module('nivel')
.service('SubmenuService', [ function () {

    var submenuItems = [];

    var self = this;

    this.add = function (el) {

        submenuItems.push(el);

    }

    this.get = function (id) {

        for(var i in submenuItems) {

            if(submenuItems[i].id == id) {

                return submenuItems[i];

            }

        }


    }




}]);
