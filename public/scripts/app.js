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
}]);

//CTRLers
//Home Ctrl.
app.controller('HomeCtrl', ['$scope', 'Story', function($scope, Story) {
  $scope.homeCtrlTest = 'Home Ctrl Test';
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

app.directive('storyWord', function($compile) {
  var linker = function(scope, element, attrs) {
    //Check if story is string. If not a string, no code counter-part.
    scope.formatForShow = function(content) {
      if(typeof(content) == 'string') {
        return content;
      } else {
        return content[1];
      }
    };

    scope.shouldShowCode = function(content) {
      if (typeof(content) == 'string') {
        return false;
      } else {
        return true;
      }
    };
    scope.codeStyle = function(content) {
      if (typeof(content) == 'string') {
        return '';
      } else { 
        return 'underline';
      }
    };

    element.html(
      //Min. width
      //if 'content' === 
      /*'<br ng-show="index%10==0">' +*/
      '<span ' + 
        'class="jsWords" ' + 
        'ng-init="changeBack=true" ' +  
        'ng-class="codeStyle(content)" ' + 
        /*'ng-mouseover="showCode=changeBack && shouldShowCode(content)" ' + */
        'ng-click="showCode=shouldShowCode(content)" ' + 
        /*'ng-mouseout="changeBack=true" ' +*/
        'ng-show="!showCode">{{ formatForShow(content) }}' + 
        '</span>' + 
      '<span ' + 
        'class="engWords underline" ' + 
        'ng-show="showCode" '+ 
        'ng-click="showCode=false; changeBack=false">{{ content[0] }}' + 
        '</span> ').show();

    $compile(element.contents())(scope);
  };

  return {
    restrict: "E",
    link: linker,
    scope: {
      content: '=',
      index: '='
    }
  };
});