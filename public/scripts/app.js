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

  $scope.onMouseOver = function(story) {
    console.log(story);
    $(this).addClass('animated bounce');
    /*debugger*/
  };

  $('li > a').on('mouseover', function(e) {
    console.log('mouseover');
    $(e.target).addClass('animated bounce').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
      $(this).removeClass('animated bounce');
    });
  });

}]);

//Story page Ctrl.
app.controller('StoryCtrl', ['$scope', 'Story', '$routeParams', function($scope, Story, $routeParams) {
  $scope.storyCtrlTest = 'Story Ctrl Test';
  $scope.story = Story.get({
    id: $routeParams.id
  });

  $scope.formatForDisplay = function(word) {
    if (typeof(word) == 'string') {
      return word;
    } else {
      return '<span class="hidden">' + word[0] + '</span><span class="underline">' + word[1] + '</span>';
    }
  };

  //Animation name. 
  var animationType = 'animated bounce';
  $('#storyTitle').addClass('animated rubberBand');
  //Toggles underline class when clicked.
  /*$('#story').click(function(e) {
    $(e.target).toggleClass('underline');
  });*/

  $('#story').on('mouseover', function(e) {
    $(e.target).toggleClass(animationType).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
      $(this).removeClass(animationType);
    });
    $(e.target).toggleClass('underline');
  });

}]);

//About Ctrl.
app.controller('AboutCtrl', ['$scope', function($scope) {
  $scope.aboutCtrlTest = 'About Ctrl Test';
}]);