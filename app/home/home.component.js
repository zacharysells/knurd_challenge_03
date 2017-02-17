'use strict';

var homeModule = angular.module('home', []);

homeModule.controller('HomeCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {
  $scope.results = [];
  var fill = true;
  var NUM_STARS = 500;
  var LIFE = 500;
  $scope.l = 1;
  $scope.r = 3;
  $scope.t = 6;

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  ctx.moveTo(0,0);
  ctx.lineTo(200,100);
  ctx.stroke();

  var adjustCanvas = function() {
    if (canvas.width !== $window.innerWidth) {
      canvas.width = $window.innerWidth;
    }
  	if (canvas.height !== $window.innerHeight) {
      canvas.height = $window.innerHeight;
    }
  };
  adjustCanvas();

  var Star = function() {
    this.width = 1;
    this.height = 1;
    this.id = Math.random();
    this.speedx = Math.random() * 10 - 5;
    this.speedy = Math.random() * 10 - 5;
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.x +=  this.speedx * Math.max(canvas.width, canvas.height) / 10;
    this.y += this.speedy * Math.max(canvas.width, canvas.height) / 10;
    this.steps = 0;
  };
  
  var stars = {}

  for (var i = 0; i < NUM_STARS; i++) {
    var star = new Star();
    stars[star.id] = star;
  }

  console.log('stars', stars);

  var draw = function() {
    adjustCanvas();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    for (var starId in stars) {
      var star = stars[starId];
      if (star.x === 0 && star.y === 0) {
        var randomNum = Math.floor(Math.random() * 5) + 1;
        star.x = Math.floor(canvas.width/randomNum);
        star.y = Math.floor(canvas.height /randomNum);
      }
      ctx.fillRect(star.x, star.y, star.width, star.height);
      star.x += star.speedx;
      star.y += star.speedy;
      star.steps += 1;
      // star.speedx += star.speedx / 50;
      // star.speedy += star.speedy / 50;
      if (Math.abs(star.x) > canvas.width || Math.abs(star.y) > canvas.height || star.steps >= LIFE) {
        delete stars[star.id];
        var newStar = new Star();
        stars[newStar.id] = newStar;
        // console.log('stars', stars);
      }
      if (star.steps === 100 || star.steps === 200) {
        star.width += 1;
        star.height += 1;
      }
    }
    // star.width += 1;
    // star.height += 1;
    
    $window.requestAnimationFrame(draw);
  };

  $window.requestAnimationFrame(draw);

  $scope.submit = function() {
    console.log('$scope.l',$scope.l);
    console.log('$scope.r',$scope.r);
    console.log('$scope.t',$scope.t);
    $http({
      method: 'GET',
      url: '/calc',
      params: {l: $scope.l, r: $scope.r, t: $scope.t}
    }).then(function(data) {
      $scope.results = data.data;
    }, function(e) {
      console.log('error get', e);
      $scope.error = 'There was an error in calculating your information. Refer to the console.';
    });
  };
}]);

homeModule.component('home', {
  templateUrl: 'home/home.component.html',
  controller: 'HomeCtrl'
});