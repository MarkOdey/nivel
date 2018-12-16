var template= angular.module('templates', []);

var app = angular.module('nivel', []);

angular.element(function() {
    console.log('instantiate');
    angular.bootstrap(document.body, ['nivel']);
});
angular
   .module('nivel')
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
   .module('nivel')
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
   .module('nivel')
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
angular
   .module('nivel')
   .filter('moment', [function() {

    return function(dateString, format) {
        return moment(dateString).format(format);
    };

}]);


angular
   .module('nivel')
   .filter('momentunix', [function() {

    return function(dateString, format) {
        return moment.unix(Number(dateString)).format(format);
    };


}]);


angular
   .module('nivel')
   .directive('moment', function () {

        return {
            restrict: 'E',
            scope : {

                format: "@",
                date : "@"

            },

            link: function ($scope, $element, $attr) {

                $element.append(moment($scope.date).format($scope.format));

            }

        }

    });



angular
   .module('nivel')
   .directive('calendarMenu', [ 'Calendar', function (Calendar) {

        return {
            restrict: 'E',
            templateUrl:"js/partials/calendar-menu.html",
            scope : {

                date : "@"

            },
            link: function ($scope, $element, $attr) {

                moment.locale('fr');


                if($scope.date == undefined) {
                    $scope.date =  moment().unix();
                }

                $scope.activeDate = moment.unix($scope.date);

                $scope.startDate = moment($scope.activeDate).weekday(1);
                $scope.endDate = moment($scope.activeDate).weekday(7);


                $scope.years = {};
                $scope.months = {};
                $scope.days = {};

                var init = function () {

                    $scope.years = {};
                    $scope.months = {};
                    $scope.days = {};

                    var yearNow = Number(moment().format('YYYY'));

                    var yearStart = yearNow - 2;
                    var yearEnd = yearNow + 2;


                    for(var y = yearStart; y<=yearEnd; y++) {

                        var year = moment([y]);
                        $scope.years[year.unix()]=year;
                    
                    }

                    var date = moment.unix($scope.date);


                    for(var m = 0; m < 12; m++) {

                        var month = moment([date.year(), m]);
                        $scope.months[month.unix()] = month;

                    }

                    console.log($scope.months);

                    for(var d=1; d <= date.daysInMonth(); d++) {

                        var day = moment([date.year(), date.month(), d]);
                        $scope.days[day.unix()] = day;

                    }



                }

                init();

                $scope.changeYear = function (date) {

                    $scope.days = {};
                    $scope.months = {};

                    for(var m = 0; m < 12; m++) {

                        var month = moment([date.year(), m]);
                        $scope.months[month.unix()] = month;

                    }

                    for(var d=1; d <= date.daysInMonth(); d++) {

                        var day = moment([date.year(), date.month(), d]);
                        $scope.days[day.unix()] = day;
                    

                    }


                    $scope.activeDate.year(date.year());


                    getData();

                }

                $scope.changeMonth = function (date) {

                    $scope.days = {};

                    for(var d=1; d <= date.daysInMonth(); d++) {

                         console.log(typeof month);

                        var day = moment([date.year(), date.month(), d]);
                        $scope.days[day.unix()] = day;
                    

                    }

                    $scope.activeDate.month(date.month());

                    getData();

                }

                $scope.changeDay = function (date) {

                    var unix = date.unix();

                    $scope.activeDate=moment.unix(unix);

                    console.log(date);

                    getData();

                }

                $scope.getNextDay = function () {


                    $scope.activeDate.add('days', 1);

                    getData();


                }

                $scope.getPreviousDay = function () {


                    $scope.activeDate.add('days', -1);

                    getData();

                }


                var getData = function () {

                   
                    $scope.startDate = $scope.activeDate;
                    
                    $scope.endDate = moment($scope.activeDate).add('days', 7);


                    Calendar.getRange($scope.startDate, $scope.endDate);
                }


                getData();


   
            }
        }
    }]);


angular
   .module('nivel')
   .directive('calendarItem', [ 'Calendar', '$compile', function (Calendar, $compile) {

        return {
            restrict: 'A',
            link: function ($scope, $element, $attr) {

                Calendar.onUpdateDate(function(items) {

                    $element.empty();
               

                    var output = "";

                    if(items != undefined) {
                        
                        for(var i in items) {

                            console.log(items[i]);
                            output += items[i].html;

                        }



                    }

                    $element.html(output);

                    console.log('updating view');


                    $compile($element.contents())($scope);


                });

            }
        }
    }]);



angular
    .module('nivel')
    .service('Calendar', [ '$http', '$q', function($http, $q) {


        var self = this;

        self.items={};
        this.activeItemId =0;

        self.activeItems = [];

        self.updateDateCallbacks = [];


        self.setItem =  function(date, item){

            self.items[date.unix()] = { 'date': date, 'html' : item };

            return self.items[date.unix()];

        };

        self.hasItem = function (date) {

            if(self.items[date.unix()] == undefined) {
                
                return false;
            
            } else {

                return true;

            }
        }      

        self.getItem = function (date) {

            return self.items[date.unix()];
        }

        self.onUpdateDate = function (cb) {

            self.updateDateCallbacks.push(cb)
        }

        self.updateDate = function (items) {

            self.activeItems = self.activeItems.sort(function(a,b) {

                console.log(a.date.unix()); 

                return Number(a.date.unix()) > Number(b.date.unix());
            });


            for(var i in self.updateDateCallbacks) {

                self.updateDateCallbacks[i](self.activeItems);
            }
        }

        self.getRange = function (start, end) {

            var current = moment(start);

            this.activeItemId = Math.random();

            self.activeItems = [];

            self.updateDate(self.activeItems);

            while(!current.isAfter(end)) {

                var date = moment(current);

                self.setActiveItem(date);

                current.add(1, 'days');

            }



        }

        self.setActiveItem = function (date) {

            var local_id = this.activeItemId;

            if( self.hasItem(date) ) {

                var item = self.getItem(date);

                self.activeItems.push(item);

                self.updateDate(self.activeItems);


            } else {


                var baseTag = document.getElementsByTagName('base');

                console.log(baseTag[0].baseURI);

                var baseUrl = baseTag[0].baseURI;
                $http({
                    url : baseUrl+'api/calendrier.html',
                    method : 'GET',
                    params : {
                        date : date.unix()
                    }
                }).then(function (response) {

                    //console.log(response.data);

                    if(response.data == undefined) {

                    } else {

                        
                        var item = self.setItem(moment(date), response.data);

                        if(local_id == self.activeItemId) {

                            self.activeItems.push(item);
                            self.updateDate(self.activeItems);
                        }



                    }

                })


            }

           
        }
 

    }]);angular
   .module('nivel')
   .directive('donation', [ '$timeout', '$http', function ($timeout, $http) {
  
	    return {
			restrict: 'E',
			templateUrl : 'js/partials/donation.html' ,
			scope : {

				buttontext : "@",
				title : "@"

			},

			link: function ($scope, $element, $attr) {

				console.log($scope.buttontext);
				console.log($scope.title);

				$scope.update = function () {

					console.log($scope.amount);
				}

				$scope.send = function () {

					console.log($element.find('form')[0]);

					$element.find('form')[0].submit();
					

					console.log('submit');
				}
			}

	    }

    }]);


// Numeric only control handler
/*jQuery.fn.ForceNumericOnly =
function()
{
    return this.each(function()
    {
        $(this).keydown(function(e)
        {
            var key = e.charCode || e.keyCode || 0;
            // allow backspace, tab, delete, arrows, numbers and keypad numbers ONLY
            return (
                key == 8 || 
                key == 9 ||
                key == 46 ||
                (key >= 37 && key <= 40) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105));
        });
    });
};

*/


angular
   .module('nivel')
   .directive('ellipsis', ['resizer', function (resizer) {

      return {
        restrict: 'A',
        scope : {

          height : "@"
        },
   
        link: function ($scope, $element, $attr) {

            $element.addClass('fadeIn');


            if($scope.height==undefined) {

                $scope.height = Number($element[0].offsetHeight);

            }

           // $element[0].style.height = $scope.height+"px";
           // $element[0].style.position = "relative";

            var reset = function () {

                for(var i =0;  i<$element[0].childNodes.length; i++) {

                    var childElement = $element[0].childNodes[i];

                    if(childElement.style == undefined) {
                        continue;
                    }
                  
                    childElement.style.display = "";

                }

            }

            reset();

            var getComputedWidth = function (element) {

                var style = element.currentStyle || window.getComputedStyle(element),
                width = element.offsetWidth,
                margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight),
                padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
               
                return width + (margin);

            }

            var getComputedHeight = function (element) {


                var style = element.currentStyle || window.getComputedStyle(element),
                height = element.offsetHeight, // or use style.width
                margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom),
                padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
           
                return height + (margin);


            }


            var resize = function (callback) {


                requestAnimationFrame(function() {


                    //console.log('resizing view');
                    reset();

                    //Loop through children and evaluate height on containter;
                    for(var i =$element[0].childNodes.length-1;  i>0; --i) {

                        var childElement = $element[0].childNodes[i];

                        if(childElement.style == undefined || childElement.tagName == "OBJECT") {

                            continue;
                        }

                        childElement.style.display = "";

                    }
                    
                    //Loop through children and evaluate height on containter;
                    for(var i =$element[0].childNodes.length-1;  i>=0; --i) {

                        var childElement = $element[0].childNodes[i];

                        if(childElement.style == undefined || childElement.tagName == "OBJECT") {

                            continue;
                        }

                        var computedHeight = getComputedHeight($element[0]);

                        if(Number($scope.height) < computedHeight) {

                            childElement.style.display = "none";

                        } else {

                            childElement.style.display = "";

                        }


                    }

                    
                    if(typeof callback == 'function'){

                        callback();

                    };

                })

            }


            resize();

            resizer.addEventListener('resize', function (callback) {

                resize(callback);

            }, $element);

            /*
            
            resizer.addEventListener('scroll', function(e) {
            

                console.log('firing');
                resize();
            });
            */
      
        }
	}
}]);
angular
   .module('nivel')
   .directive('fontFit', [ 'resizer', function(resizer) {

      return {
        restrict: 'AC',
        scope : {

          minsize : "@",
          maxsize : "@" ,
          breakevery : "@",
          step:"@"
        },
   
        link: function ($scope, $element, $attr) {

            if($scope.minsize == undefined) {
                $scope.minsize = 36;
            }

            if($scope.maxsize == undefined) {
                $scope.maxsize = 80;
            }

            if($scope.step == undefined) {

                $scope.step = 3;
            }


            var breakHtml = function (str, every) {

                console.log(str);
                var text = "";

                for (var i = 0, charsLength = str.length; i < charsLength; i += every) {
                    var chunk = str.substring(i, i + every);
                    text += chunk;
                    text += "<br/>";

                }


                return text;
            }

            if($scope.breakevery !=undefined){


                console.log($scope.breakevery);
                console.log($element.html());

                var html=breakHtml($element.html(), 2);

                $element.html(html);

            }

            var parent = $element[0].parentNode;

            var fadeIn = false;

            // With default options (will use the object-based approach).
            // The object-based approach is deprecated, and will be removed in v2.
            /*var erd = elementResizeDetectorMaker();

            erd.listenTo(parent, function(element) {
                
                fadeIn = false;
                resize();

            });*/

            var getComputedWidth = function (element) {


                var style = element.currentStyle || window.getComputedStyle(element),
                width = element.offsetWidth,
                margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight),
                padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
               
                return width + (margin);

            }

            var getComputedHeight = function (element) {


                var style = element.currentStyle || window.getComputedStyle(element),
                height = element.offsetHeight, // or use style.width
                margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom),
                padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
           
                return height;


            }
    
            var resize = function (callback) {


                $element.addClass('fadeOut');
                $element.removeClass('fadeIn');


                requestAnimationFrame(function() {

                    var font = $scope.maxsize + "px";

                    var min = Number($scope.minsize);
                    var max = Number($scope.maxsize);

                    $element[0].style.fontSize = font;

                    $element[0].style.display = "inline";

                    var size = max;

                    var cycle = Number($scope.step);

                    for(var i = 0; i < cycle; ++i) {

                        console.log(cycle);

                        size = Math.floor(size);

                        font = size + "px";

                        $element[0].style.fontSize = font;

                        var parentWidth = getComputedWidth(parent);
                        var parentHeight = getComputedHeight(parent);

                        var width = getComputedWidth($element[0]);
                        var height = getComputedHeight($element[0]);
                        console.log(parentHeight, height);

                        if(parentHeight > height && parentWidth > width) {

                            
                           // console.log('this fires');
                            //size += Math.abs(max-size)/cycle;

                        } else {

                            console.log('doest this fires');

                            size -=  Math.abs(max-min)/cycle;



                        }



                    }

                    if(typeof callback == 'function'){

                        callback();

                    };



                    window.setTimeout(function () {

                            
                        $element.addClass('fadeIn');
                        $element.removeClass('fadeOut');


                    }, 200);


                });
       
            }


            resize();

            resizer.addEventListener('resize', function (callback) {

                resize(callback);

            }, $element);

            

        }
	}
}]);
angular
   .module('nivel')
   .directive('framer', [ 'resizer', function (resizer) {

      return {
        restrict: 'E',
        scope : {
            cropx:'@',
            cropy:'@',
            cropwidth:'@',
            cropheight:'@',
            width:'@',
            height:'@',
            layout:'<'

        },
        link: function ($scope, $element, $attr) {

            var image;


            $scope.cropx = Number($scope.cropx);
            $scope.cropy = Number($scope.cropy);

            $scope.cropwidth = Number($scope.cropwidth);
            $scope.cropheight = Number($scope.cropheight);

            $scope.width = Number($scope.width);
            $scope.height = Number($scope.height);

            var elementStyle = $element[0].style;

            var parent = $element.parent();

            console.log(parent[0]);


            elementStyle.display = 'block';
            elementStyle.position = 'absolute';
            elementStyle.left = '0px';
            elementStyle.top ='0px';
            elementStyle.width = '100%';
            elementStyle.height = '100%';


            elementStyle.overflow = 'hidden';


            if($scope.layout == undefined) {

                $scope.layout = "fit";
            }


            // With default options (will use the object-based approach).
            // The object-based approach is deprecated, and will be removed in v2.
            // var erd = elementResizeDetectorMaker();

            // var resized=false;

            /* erd.listenTo($element[0], function(element) {

                    resized = false;
                    resize();



                });
            */

            resizer.addEventListener('resize', function (callback) {

                resize(callback);

            }, $element);

            $scope.$watch('layout', function () {

                console.log($scope.layout);

                resized = false;
                resize();

            });
           
            var imgDom = $element.find('img');


            imgDom.on('load', function () {

                image = this;

                resize();

            });


            

            var resize =  function (callback) {


                $element.addClass('fadeOut');
                $element.removeClass('fadeIn');



                requestAnimationFrame(function() {


                    if($scope.layout == "normal") {

                        computeNormalLayout();

                    } else if($scope.layout == "fit") {

                        computeFitLayout();

                    }
                    

                    if(typeof callback == 'function'){

                        callback();

                    };


                    window.setTimeout(function () {

                            
                        $element.addClass('fadeIn');
                        $element.removeClass('fadeOut');


                    }, 200);


                });



            }

            $scope.resize = resize;

            resize();



            var computeNormalLayout = function () {


                if(image == undefined) {
                    
                    imgDom = $element.find('img');
                    image = imgDom[0];

                }

                var parentW = $element[0].offsetWidth;
                var parentH = $element[0].offsetHeight;

                if(parentW/parentH > image.width/image.height) {

                    image.style.height = "100%";
                    image.style.width = "auto";
                    image.style.position = "absolute";
                    image.style.margin = "auto";
                    image.style.display = "block";
                    image.style.top = "0px";
                    image.style.left = parentW/2-image.width/2+"px";

                } else {

                    image.style.height = "auto";
                    image.style.width = "100%";
                    image.style.position = "absolute";
                    image.style.margin = "auto";
                    image.style.display = "block";
                    image.style.left = "0px";
                    image.style.top = parentH/2-image.height/2 + "px";

                }


            }


            var computeFitLayout = function () {


                if(image == undefined) {
                    
                    imgDom = $element.find('img');
                    image = imgDom[0];

                }

                var RCx = Number($scope.cropx) + Number($scope.cropwidth)/2;
                var RCy =  Number($scope.cropy) + Number($scope.cropheight)/2;

                var RCxPct =  RCx/$scope.width;
                var RCyPct = RCy/$scope.height;

                var imageW = image.naturalWidth;
                var imageH = image.naturalHeight;

                var parentW = $element[0].offsetWidth;
                var parentH = $element[0].offsetHeight;


                var imageRatio = imageH/imageW;

                var parentRatio = parentH/parentW;

            
                image.style.position = "absolute";

                //Width will be 100%;
                if(imageRatio > parentRatio) {

                    var imageWidth = parentW;

                    image.style.width = imageWidth+"px";
                    image.style.height = "auto";

                    var top = RCyPct * image.offsetHeight - parentH/2; 

                    if(top < 0) {

                        top = 0;
                    }

                    if(image.offsetHeight - top < parentH) {

                        top += (image.offsetHeight - top) - parentH;

                    }

                    image.style.top = -top + "px";
                    image.style.left = "0px";

                } else {

                    var imageHeight = parentH;

                    image.style.height = imageHeight + "px";
                    image.style.width = "auto";

                    var left = RCxPct * image.offsetWidth - parentW/2;

                    if(left < 0){

                        left = 0;

                    }

                    if(image.offsetWidth - left < parentW) {

                        left += (image.offsetWidth - left) - parentW;
                    }

                    image.style.top = "0px";
                    image.style.left = -left + "px";

                }
            
            }

            /* resizer.addEventListener('scroll', function(e) {
                
                console.log('firing');
                resize();
            });*/
      
        }
  };
}]);angular
   .module('nivel')
   .directive('galleryItem', [ '$timeout', function ($timeout) {
  
      return {
        restrict: 'A',

        link: function ($scope, $element, $attr) {

            console.log($scope);

            console.log($attr);

            $scope.$on('gallery-fullscreen', function (data) {


              if(data.targetScope.fullscreen) {

                $element.append("<div class='caption'>"+$attr.caption+"</div>");

              } else {

                $element.find(".caption").remove();


              }

            })

            /*window.addEventListener("resize", function() {

            	$scope.$$childHead.layout = $scope.layout;

            	$scope.$$childHead.resize();

            	console.log($scope.$$childHead.resize);


            });
          */

        }
    }
}]);angular
   .module('nivel')
   .directive('gallery', [ '$timeout', 'resizer', function ($timeout, resizer) {
  
      return {
        restrict: 'E',
        transclude : "true",

        scope : {

        },

        link: function ($scope, $element, $attr, _, transclude) {



            transclude($scope, function(clone) {
                
                $element.append(clone);
            
            });


            //The active gallery item;
            $scope.activeItem;

            var galleryItems = $element.find('[gallery-item]');

            var index = 0;

            var timer;
        
            var galleryLength = $element.find('[gallery-item]').length;


            if(galleryLength <= 1) {

                $element.find('previous')[0].style.display = "none";
                $element.find('next')[0].style.display = "none";
            }


            $element.find('previous').bind('click', function () {
                console.log('this is a test');

                previous();

            });

            $element.find('next').bind('click', function () {
                console.log('this is a test');

                next();

            });


            var next = function () {
                
                index +=1;

                index =  index%galleryItems.length;

                render();

            }


            var previous = function () {

                index -= 1;

                index = (index+galleryItems.length)%galleryItems.length;

                render();

            }



            var render = function () {

                galleryItems = $element.find('[gallery-item]');

                console.log(galleryItems);

                galleryItems.each(function( i ) {


                    if(index == i ) {

                        galleryItems[i].style.visibility = 'visible';
                        galleryItems[i].style.pointerEvents = 'auto';

                    } else {

                        galleryItems[i].style.visibility = 'hidden';
                        galleryItems[i].style.pointerEvents = 'none';

                    }

                });


            }

            $scope.layout = "fit";
            $scope.fullscreen = false;

            $element.addClass('windowed');

            $scope.setFullScreen = function (bool) {

                if(bool == true) {



                    $element.addClass('fullscreen');

                    $element.removeClass('windowed');


                    console.log('fullscreen');

                    $scope.layout = "normal";
                    $scope.fullscreen = true;


                    $element[0].style.zIndex = "100";
                    $element[0].style.position = "fixed";
                    $element[0].style.top = "0px";
                    $element[0].style.left = "0px";
                    $element[0].style.width = "100%";
                    $element[0].style.height = "100%";
                    $element[0].style.backgroundColor="#222";

                    resizer.reset();


                    window.dispatchEvent(new Event("resize"));



                } else {

                    console.log('not fullscreen');


                    $element.removeClass('fullscreen');

                    $element.addClass('windowed');

                    
                    $scope.layout = "fit";
                    $scope.fullscreen = false;

                    $element[0].style.zIndex = "";
                    $element[0].style.position = "absolute";
                    $element[0].style.top = "0px";
                    $element[0].style.left = "0px";
                    $element[0].style.width = "100%";
                    $element[0].style.height = "100%";
                    $element[0].style.backgroundColor="";


                    resizer.reset();

                    window.dispatchEvent(new Event("resize"));

                }

                $scope.$broadcast('gallery-fullscreen', $scope);


            }

            $scope.openFullScreen = function () {

                $scope.setFullScreen(true);

            }

            $scope.closeFullScreen = function () {

                $scope.setFullScreen(false);
            }



            render();

        }

    }

}]);
angular
.module('nivel')
.directive('scrollSnap', [  function() {

  return {
    restrict: 'AC',
    scope : {

      "from" : "@",
      "to" : "@"
    },

    link: function ($scope, $element, $attr) {

      

      window.document.addEventListener("touchmove", function(e){


        e.preventDefault();



      });



      window.document.addEventListener("scroll", function (e) {


        if(window.innerWidth > 800) {

          return;
        }


        if($scope.from == undefined) {

          return;

        } 

        if($scope.to == undefined) {

          return;

        }

        $scope.from = Number($scope.from);
        $scope.to = Number($scope.to);

        //console.log($scope.from);


        if($scope.from < window.scrollY  && $scope.to > window.scrollY) {

          $element[0].style.position = "fixed";
          $element[0].style.zIndex = "1000000";
          $element[0].style.top = "0px";

        } else {

          $element[0].removeAttribute("style");

     

        }


      });




      $scope.$watch("from", function() {

        if($scope.from != undefined) {

          console.log($scope.from);

        }

      });

      $scope.$watch("to", function () {

        if($scope.to != undefined) {

          console.log($scope.to);

        }

      });

    }

  }
}]);
angular
.module('nivel')
.directive('scrollTo', [  function() {

	return {
	    restrict: 'AC',
	    scope : {

	      "from" : "@",
	      "to" : "@"
	    },

	    link: function ($scope, $element, $attr) {



			window.document.addEventListener("touchmove", function(e){



			});



			window.document.addEventListener("scroll", function (e) {


			});


			

		}

	}


}]);

angular
   .module('nivel')
   .directive('toTop', ['resizer', function (resizer) {

      return {
        restrict: 'A',
        scope : {

        },
   
        link: function ($scope, $element, $attr) {

            var render = function  () {

                var top  = window.pageYOffset || document.documentElement.scrollTop;

                if(top < 200) {

                    $element[0].style.display = "none";
                } else {
                     $element[0].style.display = "block";
                }
            }

            resizer.addEventListener('scroll', function (callback) {


                render();

                callback();


            });

            $element.on('click', function() {

                window.scrollTo(0, 0);


            });
      
        }
	}
}]);

angular
   .module('nivel')
   .service('resizer', function () {

        var self = this;
        var width;
        var height;

        var events = {

            "resize" : [],
            "scroll" : []
        };


        var running = {

            "resize" : false
        }
        
        var resets = {

            "resize" : false
        }


        this.isElementInViewport = function (el) {

            //special bonus for those using jQuery
            if (typeof jQuery === "function" && el instanceof jQuery) {
                el = el[0];
            }

            var rect = el.getBoundingClientRect();

            return (
                rect.top >= -500 &&
                rect.left >= -500 &&
                rect.bottom <= (window.innerHeight+500 || document.documentElement.clientHeight+500) && /*or $(window).height() */
                rect.right <= (window.innerWidth+500 || document.documentElement.clientWidth+500) /*or $(window).width() */
            );
        }


        this.dispatch = function (key,index) {

           /* if(resets[key] = true) {

                resets[key] = false;
                return;
            } */


            if(index == undefined) {

                resets[key] = true;

                index = 0;

                events[key].sort(function (handler1, handler2) {

                    if(self.isElementInViewport(handler1.element)){
                        return -1;
                    } else {
                        return 1;
                    };

                });

            }

    
            if(events[key][index] == undefined || typeof events[key][index].callback != 'function') {

                return;

            }

            events[key][index].callback(function() {

                self.dispatch(key, index+1);

            });
            

            running[key] = false;
        }


        this.addEventListener = function (key, fn, dom) {

            if(events[key] == undefined) {

                events[key] = [];

            }

            events[key].push({ 'callback' : fn, 'element' : dom});

        }

        var resizeRunning = false;

        this.reset = function () {

            width = -1;
        }

        this.resize = function () {

            if(this.getWindowWidth() == width) {

                return;

            }


            console.log('before ' +width)
            width = this.getWindowWidth();

            console.log('after' +width);

            this.dispatch('resize');

        }

        var scrollRunning = false;

        this.scroll = function() {

            self.dispatch('scroll');

        }


        this.getWindowWidth = function() {
            var docElemProp = window.document.documentElement.clientWidth,
                body = window.document.body;
            return window.document.compatMode === "CSS1Compat" && docElemProp || body && body.clientWidth || docElemProp;
        }

    });



angular
    .module('nivel')
    .run(['resizer', function(resizer) { 

        window.addEventListener('resize', function () {

            
            resizer.resize();



        });

        window.addEventListener('scroll', function(){

            resizer.scroll();
  
        });

    }]);angular.module('templates').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('js/partials/anchor-menu.html',
    "\n" +
    "\n" +
    "<ul>\n" +
    "\n" +
    "	<li ng-repeat=\"anchor in anchors\"><a href=\"{{baseurl}}#{{anchor.id}}\">{{anchor.id}}</a></li>\n" +
    "\n" +
    "</ul>\n" +
    "<div class=\"border-top\"></div>\n" +
    "\n" +
    "        "
  );


  $templateCache.put('js/partials/calendar-menu.html',
    "<div class=\"container\">\n" +
    "\n" +
    "	<div class=\"border-top\"></div>\n" +
    "\n" +
    "	<div class=\"container submenu\">\n" +
    "\n" +
    "		<span class=\"item\" ng-repeat='(yearKey, year) in years' ng-class=\"{ active : activeDate.year() == year.year() }\" ng-click='changeYear(year)'>\n" +
    "\n" +
    "			{{year | moment : 'YYYY'}}\n" +
    "\n" +
    "		</span>\n" +
    "\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"border-top\"></div>\n" +
    "\n" +
    "	<div class=\"container submenu\">\n" +
    "\n" +
    "		<span class=\"item\" ng-repeat='(monthKey, month) in months' ng-class=\"{ active : activeDate.month() == month.month() }\" ng-click='changeMonth(month)'>\n" +
    "\n" +
    "	    	{{month | moment : 'MMMM'}}\n" +
    "		\n" +
    "		</span>\n" +
    "\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"border-top\"></div>\n" +
    "\n" +
    "	<div class=\"container submenu\">\n" +
    "\n" +
    "		<span class=\"item\" ng-repeat='(dayKey, day) in days' ng-class=\"{ active :  startDate.format('DD') <= day.format('DD') && endDate.format('DD') >= day.format('DD') }\"  ng-click='changeDay(day)'>\n" +
    "\n" +
    "		    {{day | moment : 'DD'}}\n" +
    "\n" +
    "		</span>\n" +
    "\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"border-top\"></div>\n" +
    "\n" +
    "	<div class=\"container center\">\n" +
    "\n" +
    "		<h1 style=\"padding-top:10px\">\n" +
    "			<span ng-click=\"getPreviousDay()\" class=\"icon icon-arrow-left-c\"></span>\n" +
    "\n" +
    "				{{startDate | moment : 'DD MMMM YYYY'}} / {{endDate | moment : 'DD MMMM YYYY'}}\n" +
    "			\n" +
    "			<span ng-click=\"getNextDay()\" class=\"icon icon-arrow-right-c\"></span>\n" +
    "		</h1>\n" +
    "\n" +
    "	</div>\n" +
    "</div>\n"
  );


  $templateCache.put('js/partials/donation.html',
    "<form target=\"paypal\" action=\"https://www.paypal.com/cgi-bin/webscr\" method=\"post\" target=\"_top\">\n" +
    "\n" +
    "	<input type=\"hidden\" name=\"cmd\" value=\"_cart\">\n" +
    "	<input type=\"hidden\" name=\"business\" value=\"alfonso@fonderiedarling.org\">\n" +
    "	<input type=\"hidden\" name=\"lc\" value=\"CA\">\n" +
    "	<input type=\"hidden\" name=\"item_name\" value=\"{{title}}\">\n" +
    "	<input type=\"hidden\" name=\"currency_code\" value=\"CAD\">\n" +
    "	<input type=\"hidden\" name=\"button_subtype\" value=\"products\">\n" +
    "	<input type=\"hidden\" name=\"no_note\" value=\"0\">\n" +
    "	<input type=\"hidden\" name=\"add\" value=\"1\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "	<input id=\"amount\" class=\"fieldInput\" type=\"number\" ng-model=\"amount\" name=\"amount\" >\n" +
    "		\n" +
    "\n" +
    "	<div ng-click=\"send()\" class=\"button\">\n" +
    "		\n" +
    "		{{buttontext}}\n" +
    "	\n" +
    "	</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "</form>"
  );

}]);

//# sourceMappingURL=nivel.js.map