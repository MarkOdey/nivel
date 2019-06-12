
var template= angular.module('templates', []);

var app = angular.module('nivel', []);

/*angular.element(function() {
    console.log('instantiate');
    angular.bootstrap(document.body, ['nivel']);
});*/


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
            layout:'@',
            centerx:'@',
            centery:'@',
            zoom:"@",

        },
        link: function ($scope, $element, $attr) {

            var elements;


            $scope.cropx = Number($scope.cropx);
            $scope.cropy = Number($scope.cropy);

            $scope.cropwidth = Number($scope.cropwidth);
            $scope.cropheight = Number($scope.cropheight);



            $scope.width = Number($scope.width);
            $scope.height = Number($scope.height);

            var elementStyle = $element[0].style;

            var parent = $element.parent();

            ////console.log(parent[0]);

            elementStyle.display = 'block';
            elementStyle.position = 'absolute';
            elementStyle.left = '0px';
            elementStyle.top ='0px';
            elementStyle.width = '100%';
            elementStyle.height = '100%';

            elementStyle.zIndex = "-1";



            if($scope.width == undefined) {

                $scope.width = 100;
            }


            if($scope.height == undefined) {

                $scope.height = 100;
            }

            if($scope.cropx == undefined) {

                $scope.cropx = 50;
            }

            if($scope.cropy == undefined) {

                $scope.cropy = 50;
                
            }


            if($scope.centerx == undefined) {

                $scope.centerx = 50;
            }

            if($scope.centery == undefined) {

                $scope.centery = 50;
                
            }



            if($scope.zoom == undefined) {

                $scope.zoom = 1;
            }else {

                $scope.zoom = Number($scope.zoom);
            }

            elementStyle.overflow = 'hidden';


            if($scope.layout == undefined) {

                $scope.layout = "centered";
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

            }, $element[0]);

            $scope.$watch('layout', function () {

                //console.log($scope.layout);

                resized = false;
                resize();

            });
           
            var elements = $element.children();


            elements.on('load', function () {

                resize();

            });

            elements.on('loadedmetadata', function () {

                resize();
            })

            

            var resize =  function (callback) {


                $element.addClass('fadeOut');
                $element.removeClass('fadeIn');

                //console.log(elements);

                requestAnimationFrame(function() {

                    try {

                        elements.each(function () {

                            var element = this;

                            if($scope.layout == "normal") {

                                computeNormalLayout(element);

                            } else if($scope.layout == "fit") {

                                computeFitLayout(element);

                            } else if($scope.layout == "centered") {

                                computeCenteredLayout(element);
                            } else if ($scope.layout == "right") {

                                computeRightLayout(element);
                            }
                            
                            if(typeof callback == 'function'){

                                callback();

                            };

                            window.setTimeout(function () {
                                    
                                $element.addClass('fadeIn');
                                $element.removeClass('fadeOut');

                            }, 200);

                        });


                    } catch (e) {


                        throw e;

                    }





                });



            }

            $scope.resize = resize;

            resize();


            var computed = false;


            var interval = setInterval(function() {

                if($element[0].offsetParent === null || computed == true ) {

                } else {
                    console.log('is visible')

                    resize();
                    computed = true;
                }

            }, 500);

            var computeCenteredLayout = function (element) {

                var originW, originH;

                if(element.naturalWidth != undefined) {

                    //Gets element ratio
                    originW = element.naturalWidth;
                    originH = element.naturalHeight;

                }

                if(element.videoWidth != undefined) {

                    //Gets element ratio
                    originW = element.videoWidth;
                    originH = element.videoHeight;


                }


                //Gets parent element width;
                var parentW = $element[0].offsetWidth;
                var parentH = $element[0].offsetHeight;

                console.log(parentW, parentH)


                var elementRatio = originH/originW;

                var parentRatio = parentH/parentW;

                var elementW;
                var elementH;


                //Width will be 100%;
                if(elementRatio > parentRatio) {

                    elementW = parentW*$scope.zoom;
                    elementH = (originH/originW)*elementW;

                } else {

                    elementH = parentH*$scope.zoom;
                    elementW = (originW/originH)*elementH;

                }


                var leftPos = (parentW*0.5)-(Number($scope.centerx)/100)*elementW;
                var topPos  = (parentH*0.5)-(Number($scope.centery)/100)*elementH;


                element.style.position = "absolute";
                element.style.display = "block";
                element.style.left = leftPos+"px";
                element.style.top = topPos+"px";
                element.style.width = elementW+"px";
                element.style.height = elementH+"px";

            }

            var computeRightLayout = function (element) {

                element.style.position = "absolute"
                element.style.right ="0";
                element.style.top = "0";
                element.style.height= "100%";
            }


            var computeNormalLayout = function (element) {


                var parentW = $element[0].offsetWidth;
                var parentH = $element[0].offsetHeight;

                console.log(element.height);
                console.log(element.width)

                if(parentW/parentH > element.width/element.height) {

                    element.style.height = "100%";
                    element.style.width = "auto";
                    element.style.position = "absolute";
                    element.style.margin = "auto";
                    element.style.display = "block";
                    element.style.top = "0px";
                    element.style.left = parentW/2-element.width/2+"px";

                } else {

                    element.style.height = "auto";
                    element.style.width = "100%";
                    element.style.position = "absolute";
                    element.style.margin = "auto";
                    element.style.display = "block";
                    element.style.left = "0px";
                    element.style.top = parentH/2-element.height/2 + "px";

                }


            }


            var computeFitLayout = function (element) {


                var RCx = Number($scope.cropx) + Number($scope.cropwidth)/2;
                var RCy =  Number($scope.cropy) + Number($scope.cropheight)/2;

                var RCxPct =  RCx/$scope.width;
                var RCyPct = RCy/$scope.height;


                if(element.naturalWidth != undefined) {

                    //Gets element ratio
                    var elementW = element.naturalWidth;
                    var elementH = element.naturalHeight;

                }

                if(element.videoWidth != undefined) {
                    
                    //Gets element ratio
                    var elementW = element.videoWidth;
                    var elementH = element.videoHeight;

                }


                //Gets parent element width;
                var parentW = $element[0].offsetWidth;
                var parentH = $element[0].offsetHeight;


                var elementRatio = elementH/elementW;

                var parentRatio = parentH/parentW;

            
                element.style.position = "absolute";

                //Width will be 100%;
                if(elementRatio > parentRatio) {

                    var elementWidth = parentW;

                    element.style.width = elementWidth+"px";
                    element.style.height = "auto";

                    var top = RCyPct * element.offsetHeight - parentH/2; 

                    if(top < 0) {

                        top = 0;
                    }

                    if(element.offsetHeight - top < parentH) {

                        top += (element.offsetHeight - top) - parentH;

                    }

                    element.style.top = -top + "px";
                    element.style.left = "0px";

                } else {

                    var elementHeight = parentH;

                    element.style.height = elementHeight + "px";
                    element.style.width = "auto";

                    var left = RCxPct * element.offsetWidth - parentW/2;

                    if(left < 0){

                        left = 0;

                    }

                    if(element.offsetWidth - left < parentW) {

                        left += (element.offsetWidth - left) - parentW;
                    }

                    element.style.top = "0px";
                    element.style.left = -left + "px";

                }
            
            }

            /* resizer.addEventListener('scroll', function(e) {
                
                //console.log('firing');
                resize();
            });*/
      
        }
  };
}]);angular
   .module('nivel')
   .directive('galleryItem', [ '$timeout', 'GalleryService', function ($timeout, GalleryService) {
  
      return {
        restrict: 'A',

        scope : true,

        link: function ($scope, $element, $attr) {

            $scope.gallery = {};

            $scope.shown = false;


            if($attr.id == undefined) {

                $scope.id = "galleryItem"+Math.round(Math.random()*100000);
                

            } else {

                $scope.id = $attr.id;
            
            }


            $scope.$on('gallery-instantiated', function(gallery) {

                console.log(gallery);


               if($attr.gallery == undefined) {

                  $scope.gallery = gallery.targetScope;

                 
               } else {

                  if($attr.gallery == gallery.targetScope.id) {

                     $scope.gallery = gallery.targetScope;


                     console.log($scope.gallery);
                  }

               }


               $scope.gallery.items.push($scope);
               GalleryService.add($scope);
            

            });


            $scope.show = function () {

               $element.addClass('active');

               $scope.shown = true;

               $scope.$emit('shown', $scope);

            }

            $scope.hide = function  () {

               $element.removeClass('active');

               $scope.shown = false;

               $scope.$emit('hidden', $scope);
             
            }

            $scope.$on('gallery-fullscreen', function (data) {

               if(data.targetScope.fullscreen) {

                  $element.append("<div class='caption'>"+$attr.caption+"</div>");

               } else {

                  $element.find(".caption").remove();

               }

            })


            $scope.$emit('rendered');

         }
      }
   }
]);


angular
   .module('nivel')
   .directive('next', [ '$timeout', 'GalleryService', function ($timeout, GalleryService) {
  
      return {
         restrict: 'A',
         scope : true,

         link: function ($scope, $element, $attr) {

            var gallery = $scope.$parent;

            if($attr.target != undefined) {

               gallery = GalleryService.get($attr.target);

            } else {

               $scope.$on('gallery-instantiated', function(e) {

                  gallery = e.targetScope;

               });
            
            }

            var getGallery = function () {
               
               if($attr.target != undefined) {

                  gallery = GalleryService.get($attr.target);

               }
            

            }


            $element.on('click', function () {

               getGallery();

               gallery.next();

            });




         }
      }
   }
]);


angular
   .module('nivel')
   .directive('previous', [ '$timeout', 'GalleryService', function ($timeout, GalleryService) {
  
      return {
         restrict: 'A',
         scope : true,

         link: function ($scope, $element, $attr) {

            var gallery = $scope.$parent;

            if($attr.target != undefined) {

               gallery = GalleryService.get($attr.target);

            } else {

               $scope.$on('gallery-instantiated', function(e) {

                  gallery = e.targetScope;

               });
            
            }

            var getGallery = function () {
               
               if($attr.target != undefined) {

                  gallery = GalleryService.get($attr.target);

               }
            

            }


            $element.on('click', function () {

               getGallery();
               gallery.previous();

            });


         }
      }
   }
]);


angular
   .module('nivel')
   .directive('goto', [ '$timeout', 'GalleryService', function ($timeout, GalleryService) {
  
      return {
        restrict: 'AE',

        scope : true,

        link: function ($scope, $element, $attr) {

            var item = GalleryService.get($attr.target);

            $element.on('click', function () {

               console.log('go to ', $attr.target);

               item = GalleryService.get($attr.target);

               console.log(item);

               item.show();

            });

            console.log(item);

            if(item != undefined) {

               if(item.shown == true) {

                  $element.addClass('selected');

               }


               item.$on('shown', function (e) {

                  console.log('image changed');


                  $element.addClass('selected');
      


               });


               item.$on('hidden', function (e) {

                  $element.removeClass('selected');

               });

            
            } else {


               $scope.$on('gallery-instantiated', function(e) {

                  item = GalleryService.get($attr.target);                  

                  item.$on('shown', function (e) {

                     console.log('image changed');
                     $element.addClass('selected');
         
                  });


                  item.$on('hidden', function (e) {

                     $element.removeClass('selected');

                  });


               });


            }

            





        }

      }

   }]);
angular
   .module('nivel')
   .directive('gallery', [ '$timeout', 'resizer', 'GalleryService', function ($timeout, resizer, GalleryService) {
  
      return {
        restrict: 'E',
        transclude : "true",

        scope : {

            layout : "@",



        },

        link: function ($scope, $element, $attr, _, transclude) {


            transclude($scope, function(clone) {
                
                $element.append(clone);

            
            
            });


            if($attr.id == undefined) {

                $scope.id = "gallery"+Math.round(Math.random()*100000);
                

            } else {

                $scope.id = $attr.id;
            }


            $scope.items = [];


            

            $scope.$broadcast('gallery-instantiated', $scope);

            var index = 0;

            var timer;
        
    
            $scope.$on('shown', function (e) {

                var item = e.targetScope;

                console.log(item);

                for(var i in $scope.items) {

                    if($scope.items[i].id != item.id) {


                        $scope.items[i].hide();

                    } else {
                        
                        //The current index of the item is i;

                        index = Number(i);

                        //Element index 
                        
                        var width = $element.width();


                    }

                }
                
                if($scope.layout == "slider") {

                    $element[0].style.left= -index*$element.width() + "px";



                }


                if($scope.layout == "carrousel") {

                    var offsetLeft = 0;

                    var parentWidth = $element.width();

                    //We have the index of the active item;
                    
                    //We check the position of active item and determine if visible or not
                    var id = $scope.items[index].id;
                    var element = $element.find("#"+ id);

                    console.log(element[0].offsetLeft);
                    console.log($element[0].offsetLeft);


                    if(element[0].offsetLeft >= -1*$element[0].offsetLeft &&
                       element[0].offsetLeft + element.width() < parentWidth) {

                        console.log('item is visible');
                        

                    } else if(element[0].offsetLeft <= -1*$element[0].offsetLeft){

                        console.log('before');
                        $element[0].style.left = -(element[0].offsetLeft) + "px";

                    } else if(element[0].offsetLeft + element.width() > parentWidth) {
                        
                        console.log('after');
                        $element[0].style.left = $element.width()-(element.width()+element[0].offsetLeft) + "px";

                    }
                    
    


                }

            })


            resizer.addEventListener('resize', function (callback) {
                

                render();

                callback();

            }, $element);


            var next = function () {
                
                index += 1;

                index = index%$scope.items.length;

                render();

            }

            $scope.next = next;

            var previous = function () {

                index -= 1;

                index = (index+$scope.items.length)%$scope.items.length;

                render();

            }

            $scope.previous = previous;

            var render = function () {

                if($scope.layout == "slider" ||
                   $scope.layout == "carrousel") {

                    console.log('slider');
                    console.log($element.width());
                    console.log($element.height());

                    $element.addClass('slider');

                    console.log("rendering!!");

                    var offsetLeft = 0;

                    for(var i in $scope.items) {

                        var id = $scope.items[i].id;

                        var element =  $element.find("#"+id);



                        element[0].style.left = offsetLeft+"px";

                        offsetLeft += element.width();

                    }   

                } 

                for(var i in $scope.items) {



                    if(index == i) {

                        $scope.items[i].show();

                    } else {

                        $scope.items[i].hide();

                    }
                }

            }

            if($scope.layout == undefined) {
                $scope.layout = "fit";
            }


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


            //Adding gallery add scope.
            GalleryService.add($scope);

            render();

        }

    }

}]);

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
}]);/**
 * Sets the size of the element according to a target ratio.
 * 
 */
angular
   .module('nivel')
   .directive('ratio', [ 'resizer', function (resizer) {

        return {
            restrict: 'A',
            scope : {
                width:'@',
                height:'@',
                layout:"@"
            },
            link: function ($scope, $element, $attr) {

                if($scope.layout == undefined) {

                    $scope.layout = "width"
                }


                var resize =  function(callback) {

                    console.log("ratio")

                    if($scope.layout == "width") {


                        var width = 4;
                        var height = 3;

                        if($scope.width != undefined) {

                            width = Number($scope.width);
                        }

                        if($scope.height != undefined) {

                            height = Number($scope.height);

                        }

                        $element[0].style.position="relative";
                        $element[0].style.width="100%";


                        $element[0].style.height= (height/width)*$element.width() + "px";


                        if(callback != undefined) {
                            callback();

                        }

                    } 
                }


                resizer.addEventListener('resize', function (callback) {

                    resize(callback);

                }, $element[0]);


                resize();

            }
        }

    }]);


angular
.module('nivel')
.directive('scrollFade', [  function() {

	return {
	    restrict: 'AC',
	    scope : {

	      "animationin" : "@",
	      "animationout" : "@",
	      "from":"@",
	      "to":"@",
	      "visible":"@"


	    },

	    link: function ($scope, $element, $attr) {




	    	//console.log('nivel is updating');
	    	var shown = false;


	    	update();

	    	var debounce;
	    	var updating = false;
	    	
			var scrollEvent = window.document.addEventListener("scroll", function (e) {

				if(debounce != undefined) {

				//	clearTimeout(debounce);
				} else {

				}

			

				if(updating == false) {

					updating = true;

					debounce = setTimeout(function () {

						update();

						updating = false;

					}, 200);



				}


			});


			function update() {

				//console.log('at scroll');

				if($scope.visible != undefined) {

					//console.log('based on visible');

					var element;

					if($scope.visible == "parent") {

						element = $element.parent();
					} else {


						element = angular.element($scope.visible);
					}

					var isVisible = checkVisible(element[0]);

					if(isVisible) {

						//console.log('in bound');

						show();

					} else {

						//console.log('out bound');
						
						hide();
				
					}



					return;
				}

				if($scope.to != undefined && $scope.from != undefined) {

					var inBound = checkBound();
					if(inBound) {

						//console.log('in bound');

						show();

					} else {

						//console.log('out bound');
						
						hide();
				
					}


					return;
				}
			

			}

			function checkBound() {

				var doc = window.document;

				var top = window.pageYOffset ;

				if($scope.from == undefined) {

					$scope.from = 0;
				}

				//console.log('on scroll');
				//console.log(top);

				if(Number.isNaN(top)) {

					return;
				}

				//console.log($scope.from);

				//console.log(Number($scope.from));

				if(Number($scope.to) < Number(top) ||
				   Number($scope.from) > Number(top)) {

					return false;

				} else {

					return true;

				}


			}


			function checkVisible(elm) {

				if(elm == undefined) {

					console.log('element undefined');
					return;

				}

				var rect = elm.getBoundingClientRect();
				var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
				return !(rect.top + rect.height < 0 || rect.top - viewHeight >= 0);
			}


			$scope.$on('$destroy', function () {

				console.log('destroy')

				window.document.removeEventListener("scroll", scrollEvent);

			});


			function hide () {


				if(shown) {

					//console.log('hide');

					if($scope.animationin != undefined) {


						$element.removeClass($scope.animationin);

						$element.addClass('animated');

						$element.addClass($scope.animationout);


					} else {



						//$element[0].style.display = "none";
						//
						
						////s$element[0].style.visibility = "visible";
						
						$element[0].style.transition = "opacity 0.5s linear";


					}




					shown = false;

				}
				

			}

			function show () {

				$element[0].style.opacity = "1";

				if(!shown) {

					//console.log('show');

					if($scope.animationout != undefined) {

						$element.removeClass($scope.animationout);

						$element.addClass('animated');

						$element.addClass($scope.animationin);

					} else {


						$element[0].style.transition = "opacity 0.5s linear";

					}				

					//$element[0].style.display = "block";

					shown = true;

				}

			}

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

angular.module('nivel').factory('Emitter', ['$log', function($log) {

    var Emitter = function() {

        var self = this;

        /**
         * Stack of registered event.
         * @type {Object}
         */
        self.events = {};

        /**
         * Registers a new emitter.
         * @param  {String} event The key reference of the event registered
         */
        self.register = function(event) {

            if (Array.isArray(event)) {

                for (var i in event) {

                    if(!self.has(event[i])) {
                        
                        self.events[event[i]] = [];

                    }

                }

            } else {

                if(!self.has(event)) {

                    self.events[event] = [];

                }

            }

        };

        /**
         * Checks wether the object has a specific event registered.
         */
        self.has = function(event) {

            if (self.events[event] != undefined) {
                return true;
            }

            return false;
        }

        /**
         * Registers an handler to the event.
         * @param  {String}   event The event key to register to.
         * @param  {Function} fn    The callback to fire.
         * @return {Function}       The function reference.
         */
        self.on = function(event, fn) {

            if (self.has(event) == false) {

                self.register(event);

                $log.error('Event "' + event + '" is not registered! At on emitter');
            }

            self.events[event].push(fn);

            return fn;

        };

        /**
         * Copy of the on event.
         */
        self.addEventListener = self.on;

        /**
         * Emits the event. 
         * @param  {String} event "The event key to emit to."
         * @param  {Object} obj   The payload passed in the callback.
         */
        self.emit = function(event, obj) {

            if(obj == undefined) {
              obj = {};
            }

            if (self.events[event] == undefined) {
                $log.error('Event "' + event + '" is not registered! At on emitter');
            }

            for (var i in self.events[event]) {

                self.events[event][i](obj);
            }

        };

        /**
         * [off description]
         * @param  {String}   event "The event key to deregister the event."
         * @param  {Function} fn    The callback reference.
         */
        self.off = function(event, fn) {

            if (self.events[event] == undefined) {
                $log.error('Event "' + event + '" is not registered! At off emitter');
            }

            var index = self.events[event].indexOf(fn);

            if (index != -1) {
                self.events[event].splice(index, 1);
            } else {
                $log.error('Event "' + event + '" event callback not found in stack.');
            }

        };

        /**
         * This is a reference of off for flavor suport
         */
        self.removeEventListener= self.off;
    }

    return Emitter;

}]);


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


window.nivelConfiguration = {

}


var language = localStorage.getItem("language");

if(language == undefined) {

    localStorage.setItem("language", navigator.language);

    window.nivelConfiguration.language = navigator.language;

} else {

    window.nivelConfiguration.language = language;

}


if(nivelConfiguration.language.indexOf("fr") != -1) {

    window.nivelConfiguration.lang = 'fr';

} else {

    window.nivelConfiguration.lang = 'en';

}




var style = document.createElement('style');
style.innerHTML =
    '[lang=!'+window.nivelConfiguration.lang+'] { display:none;}';


// Get the first script tag
var ref = document.querySelector('script');

// Insert our new styles before the first script tag
ref.parentNode.insertBefore(style, ref);


console.log(window.nivelConfiguration.language);



angular
   .module('nivel')
   .service('Language', [ 'Emitter', function (Emitter) {



      Emitter.apply(this, arguments);

      var self = this;

      this.register('changed');     

   		//default language
   		this.lang = 'en';



   		if(nivelConfiguration.language.indexOf("fr") != -1) {

   			this.lang = 'fr';

   		}

      this.set = function (lang) {

        console.log(lang);
        
        this.lang = lang;

        this.emit('changed', lang);

      }


   		this.add = function(){


   		};

   		this.remove = function () {

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