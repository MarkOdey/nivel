

angular
   .module('fonderieComponent')
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
    .module('fonderieComponent')
    .run(['resizer', function(resizer) { 

        window.addEventListener('resize', function () {

            
            resizer.resize();



        });

        window.addEventListener('scroll', function(){

            resizer.scroll();
  
        });

    }]);