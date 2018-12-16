
angular
   .module('fonderieComponent')
   .filter('moment', [function() {

    return function(dateString, format) {
        return moment(dateString).format(format);
    };

}]);


angular
   .module('fonderieComponent')
   .filter('momentunix', [function() {

    return function(dateString, format) {
        return moment.unix(Number(dateString)).format(format);
    };


}]);


angular
   .module('fonderieComponent')
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
   .module('fonderieComponent')
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
   .module('fonderieComponent')
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
    .module('fonderieComponent')
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
 

    }]);