// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'ngResource', 'starter.controllers', 'ngCordova', 'gettext'])


.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })
  .config(['$httpProvider', function($httpProvider, gettextCatalog) {
    $httpProvider.defaults.withCredentials = false;
  }])
  .config(['$httpProvider',
    function($httpProvider) {
      // Set the httpProvider "not authorized" interceptor
      $httpProvider.interceptors.push(['$q', '$location', 'Authentication',
        function($q, $location, Authentication) {
          return {
            responseError: function(rejection) {
              switch (rejection.status) {
                case 401:
                  // Deauthenticate the global user
                  Authentication.user = null;

                  // Redirect to signin page
                  $location.path('signin');
                  break;
                case 403:
                  // Add unauthorized behaviour
                  break;
              }

              return $q.reject(rejection);
            }
          };
        }
      ]);
    }
  ])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })
    .state('app.weathermap', {
      url: "/weathermap",
      views: {
        'menuContent': {
          templateUrl: "templates/weathermap.html",
          // controller: 'MainController'
        }
      }
    })
    .state('app.createAccount', {
      url: "/createAccount",
      views: {
        'menuContent': {
          templateUrl: "templates/createAccount.html",
          controller: 'AppCtrl'
        }
      }
    }).
    state('app.signin', {
      url: "/signin",
      views: {
        'menuContent': {
          templateUrl: 'templates/login.html',
          controller: 'AppCtrl'
        }
      }
    })
    .state('app.editprofile', {
      url: "/editprofile",
      views: {
        'menuContent': {
          templateUrl: "templates/editProfile.html",
          // controller: 'MainController'
        }
      }
    })
    .state('app.viewprofile', {
      url: "/viewprofile",
      views: {
        'menuContent': {
          templateUrl: "templates/viewProfile.html",
          // controller: 'MainController'
        }
      }
    })
    .state('app.notify', {
      url: "/notify",
      views: {
        'menuContent': {
          templateUrl: "templates/notify.html",
          // controller: 'MainController'
        }
      }
    })
    .state('app.home', {
      url: "/home",
      views: {
        'menuContent': {
          templateUrl: "templates/home.html",
          // controller: 'CollectPaymentCtrl'
        }
      }
    });

// if none of the above states are matched, use this as the fallback
$urlRouterProvider.otherwise('/app/home');
});
