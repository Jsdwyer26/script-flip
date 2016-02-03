var app = angular.module('myApp', ['ngRoute', 'ngResource', 'ngSanitize']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'templates/home.html',
      controller: 'HomeCtrl'
    })
    .when('/story/:id', {
      templateUrl: 'templates/story.html',
      controller: 'StoryCtrl'
    })
    .when('/about', {
      templateUrl: 'templates/about.html',
      controller: 'AboutCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
  $locationProvider
    .html5Mode({
      enabled: true,
      requiredBase: false
    });
}]);

app.factory('Story', ['$resource', function($resource) {
  return $resource('/api/stories/:id', {
    id: '@id'
  }, {
    'update': {
      method: 'PUT'
    }
  });

  /* $resource methods
  { 'get':    {method:'GET'},
    'save':   {method:'POST'},
    'query':  {method:'GET', isArray:true},
    'remove': {method:'DELETE'},
    'delete': {method:'DELETE'} };*/

}]);

//CTRLers
//Home Ctrl.
app.controller('HomeCtrl', ['$scope', 'Story', function($scope, Story) {
  $scope.homeCtrlTest = 'Home Ctrl Test';
  //'.query'--$resources, GET method, isArray:true.
  $scope.stories = Story.query();

}]);

//Story page Ctrl.
app.controller('StoryCtrl', ['$scope', 'Story', '$routeParams', function($scope, Story, $routeParams) {
  $scope.storyCtrlTest = 'Story Ctrl Test';
  $scope.story = Story.get({
    id: $routeParams.id
  });

}]);

//About Ctrl.
app.controller('AboutCtrl', ['$scope', function($scope) {
  $scope.aboutCtrlTest = 'About Ctrl Test';
}]);

app.directive('storyWord', function ($compile) {
    var linker = function(scope, element, attrs) {
        scope.hi = function(content) { 
          console.log('hi', content);
        };
        element.html('<span ng-mouseover="hi(content)">{{ content }} </span>').show();

        $compile(element.contents())(scope);
    };

    return {
        restrict: "E",
        link: linker,
        scope: {
            content:'='
        }
    };
});
