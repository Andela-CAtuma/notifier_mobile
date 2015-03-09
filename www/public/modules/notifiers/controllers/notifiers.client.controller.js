'use strict';

// Notifiers controller
angular.module('notifiers').controller('NotifiersController', ['$scope', '$stateParams', '$state', '$location', 'Authentication', 'Notifiers',
  function($scope, $stateParams, $state, $location, Authentication, Notifiers) {
    $scope.authentication = Authentication;
    $scope.notifier = '';

    $scope.submitMessage = function() {
      var email = new Notifiers({
        email_message: this.notifier.email_message,
        email : this.notifier.email,
        subject : this.notifier.subject,
        location: this.notifier.location
      });
      email.$save(function(response) {
        $state.transitionTo($state.current, $stateParams, {
        	reload: true,
        	inherit: true
        });

        $scope.notifier = '';
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);
