'use strict';

var homeModule = angular.module('home', []);

homeModule.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {
  console.log('inHomeCtrl');

  $scope.submit = function() {
    console.log('$scope.l',$scope.l);
    console.log('$scope.r',$scope.r);
    console.log('$scope.t',$scope.t);
    $http({
      method: 'GET',
      url: '/calc',
      params: {l: $scope.l, r: $scope.r, t: $scope.t}
    }).then(function(data) {
      console.log('get data', data);
    }, function(e) {
      console.log('error get', e);
    });
  };
}]);

homeModule.component('home', {
  templateUrl: 'home/home.component.html',
  controller: 'HomeCtrl'
});