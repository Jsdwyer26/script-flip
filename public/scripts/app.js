var app = angular.module('myApp', ['ngRoute', 'ngResource', 'ngSanitize', 'ngAnimate']);

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
    .when('/author', {
      templateUrl: 'templates/create.html',
      controller: 'CreateCtrl'
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
/*{ 'get':    {method:'GET'},
  'save':   {method:'POST'},
  'query':  {method:'GET', isArray:true},
  'remove': {method:'DELETE'},
  'delete': {method:'DELETE'} };*/

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
  $scope.deleteStory = function(story) {
    Story.remove({ id: $routeParams.id });
  };

}]);

// Story create Ctrl.
app.controller('CreateCtrl', ['$scope', 'Story', function($scope, Story){
  $scope.createTest = 'Create Ctrl Test';
  $scope.story = {};
  $scope.checkTst = function() {
    console.log('foo');
  };
  $scope.createStory = function() {
    console.log('foo');
    var newStory = Story.save($scope.story);
    $scope.story = {};
    console.log(newStory);
  };

}]);

//About Ctrl.
app.controller('AboutCtrl', ['$scope', function($scope) {
  $scope.aboutCtrlTest = 'About Ctrl Test';

}]);


//Custom directive that allows access to the elements values as strings.
//Enables the ability to format strings to be hidden or shown. 
app.directive('storyWord', function($compile) {
  var linker = function(scope, element, attrs) {
    //Check if story is string. If not a string, no code counter-part.
    scope.formatForShow = function(content) {
      if(typeof(content) == 'string') {
        return content;
      } else {
        return content[0];
      }
    };
   
    // If string, return.
    scope.shouldShowCode = function(content) {
      if (typeof(content) == 'string') {
        return false;
      } else {
        return true;
      }
    };
    //
    scope.codeStyle = function(content) {
      if (typeof(content) == 'string') {
        return '';
      } else { 
        return 'underline';
      }
    };
    scope.lineBreak = function(content) {
      var breaks = new RegExp(/[.]/g);
      console.log(content);
      var found = breaks.test(content);
      //console.log(found);

    };
    
    element.html(
      //if 'content' === 
      /*'<br ng-show="index%10==0">'+*/
      /*'<br ng-show="index%10==0">'+*/
      '<span ' + 
        'class="jsWords" ' + 
        'ng-init="changeBack=true" ' +  
        'ng-class="codeStyle(content)" ' + 
        /*'ng-mouseover="showCode=changeBack && shouldShowCode(content)" ' + */
        'ng-click="showCode=shouldShowCode(content); lineBreak(content)" ' + 
        /*'ng-mouseout="changeBack=true" ' +*/
        'ng-show="!showCode">{{ formatForShow(content) }}' + 
        '</span>' + 
      '<span ' + 
        'class="engWords underline" ' + 
        'ng-show="showCode" '+ 
        'ng-click="showCode=false; changeBack=false; ">{{ content[1] }}' + 
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