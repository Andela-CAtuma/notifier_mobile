angular.module('starter.controllers', ['ngResource', 'ionic'])

.controller('AppCtrl', function($scope, $timeout, $http, $location, Authentication) {
  $scope.authentication = Authentication;

  // If user is signed in then redirect back home
  // if ($scope.authentication.user) $location.path('/');

  $scope.signup = function() {
    console.log('data', $scope.credentials);
    var signup_user = {
      method: 'POST',
      url: '//localhost:5000/auth/signup',
      headers: {
              'Content-Type': undefined
            },
            data: $scope.credentials
    };

    $http(signup_user).success(function(response) {
    console.log('data', response);

    // $http.post('//notifier007.herokuapp.com/auth/signup', $scope.credentials).success(function(response) {
      // If successful we assign the response to the global user model
      $scope.authentication.user = response;

      //And redirect to the index page
      $location.path('/app/viewprofile');
    }).error(function(response) {
      $scope.error = response.message;
    });
  };
  $scope.signin = function() {
    console.log('data', $scope.credentials);
    $http.post('//localhost:5000/auth/signin', $scope.credentials).success(function(response) {
      // If successful we assign the response to the global user model
      $scope.authentication.user = response;

      // And redirect to the index page
      $location.path('/app/notify');
    }).error(function(response) {
      $scope.error = response.message;
    });
  };
    // // Form data for the login modal
    // $scope.loginData = {};

    // // Create the login modal that we will use later
    // $ionicModal.fromTemplateUrl('templates/login.html', {
    //     scope: $scope
    // }).then(function(modal) {
    //     $scope.modal = modal;
    // });

    // // Triggered in the login modal to close it
    // $scope.closeLogin = function() {
    //     $scope.modal.hide();
    // };

    // // Open the login modal
    // $scope.login = function() {
    //     $scope.modal.show();
    // };

    // // Perform the login action when the user submits the login form

    // $scope.doLogin = function() {

    //   $scope.loginData = {email: $scope.loginData.username, password: $scope.loginData.password, "ttl": 1209600000};

    //   console.log('Doing login', $scope.loginData);

    //   $scope.loginResult = Merchant.login($scope.loginData,function() {
    //       console.log("Logged in");
    //       $scope.closeLogin();
    //     }, function(res) {
    //       console.log("Not logged in");
    //       $scope.closeLogin();
    //     });

    //   console.log($scope.loginResult);

    // };

})
.run(function($rootScope) {
  $rootScope.networkStatus = navigator.onLine ? 'online' : 'offline';
  $rootScope.$apply();

  if (window.addEventListener) {
    window.addEventListener("online", function() {
      $rootScope.networkStatus = "online";
      $rootScope.$apply();
    }, true);
    window.addEventListener("offline", function() {
      $rootScope.networkStatus = "offline";
      $rootScope.$apply();
    }, true);
  } else {
    document.body.ononline = function() {
      $rootScope.networkStatus = "online";
      $rootScope.$apply();
    };
    document.body.onoffline = function() {
      $rootScope.networkStatus = "offline";
      $rootScope.$apply();
    };
  }
  console.log('run function', $rootScope.networkStatus);
});
