'use strict';

// Declare app level module which depends on views, and components
var knurdModule = angular.module('knurd', [
  'ui.router',
  'home'
]);

knurdModule.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('home', {
      url: "/",
      template: "<home></home>"
    });
}]);