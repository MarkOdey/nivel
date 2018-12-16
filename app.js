var app = angular.module('fonderieComponent', []);

angular.element(function() {
    console.log('instantiate');
    angular.bootstrap(document.body, ['fonderieComponent']);
});