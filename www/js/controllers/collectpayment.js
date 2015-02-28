angular.module('starter.controllers').controller('CollectPaymentCtrl', ['$scope', '$http', '$ionicModal', 'gettextCatalog', '$http', '$timeout', '$rootScope', 'CordovaNetworkAsync', 'LocalForage',
  function($scope, $http, $ionicModal, gettextCatalog, $http, $timeout, $rootScope, CordovaNetworkAsync, LocalForage) {

    $scope.variousLanguages = [{
      'value': 'sw_KE',
      'lang': 'Swahili'
    }, {
      'value': 'fr_FR',
      'lang': 'French'
    }, {
      'value': 'en',
      'lang': 'English'
    }];

    $scope.newLanguage = $scope.variousLanguages[2];

    $scope.getChosenLanguage = function(language) {
      $scope.newLanguage = language;
      gettextCatalog.setCurrentLanguage($scope.newLanguage.value);
      gettextCatalog.debug = true;
      $scope.currencyFilter();
    };

    $scope.currencyFilter = function() {
      if ($scope.newLanguage.value === 'sw_KE') {
        $scope.currency = 'KSh';
      } else {
        $scope.currency = '$';
      }
    };

    $scope.next = function() {
      console.log('NEXT');
      $scope.$broadcast('slideBox.nextSlide');
    };
    $scope.slideChanged = function(index) {
      console.log('Slide changed', index);
      $scope.currentRecipient = scope.recipients[index];
    };

    $scope.amountCharged = "0";
    $scope.pincode = "";
    $scope.isAmount = function() {
      return (parseInt($scope.amountCharged, 10) > 0) ? false : true;
    };

    //force ng repeat to 9 times
    $scope.getTimes = function(n) {
      return new Array(n);
    };
    $scope.add = function(number) {
      $scope.amountCharged += number;
    };
    $scope.delete = function() {
      if ($scope.amountCharged.length > 1) {
        $scope.amountCharged = $scope.amountCharged.substring(0, $scope.amountCharged.length - 1);
      }
    };
    $scope.clear = function() {
      $scope.amountCharged = "0";
    };

    $ionicModal.fromTemplateUrl('pin-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function() {
      $scope.modal.show();
    };

    $scope.$watch('networkStatus', function(newVal, oldVal) {
      //Can broadcast this value to all other controllers.
      console.log(newVal, 'newVal');
    });

    $scope.closeModal = function() {
      $scope.storeOfflineData($scope.networkStatus, parseInt($scope.amountCharged, 10));
      $scope.modal.hide();
      $scope.amountCharged = "0";
      $scope.pincode = "";
    };

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });

    $scope.addpin = function(value) {
      if ($scope.pincode.length < 4) {
        $scope.pincode = $scope.pincode + value;
        if ($scope.pincode.length === 4) {
          //and is verified
          $timeout(function() {
            console.log("The four digit code was entered");
          }, 500);
        }
      }
    };

    $scope.pindelete = function() {
      if ($scope.pincode.length > 0) {
        $scope.pincode = $scope.pincode.substring(0, $scope.pincode.length - 1);
      }
    };


    $scope.offlineData = [];
    $scope.storeOfflineData = function(status, data) {
      var offlineDataObject = {
        method: 'POST',
        url: 'recipient/transfer',
        data: {
          amount: data,
          date: Date.now()
        }
      };
      if (status === 'offline') {
        $scope.offlineData.push(offlineDataObject);
        $scope.showTable = true;
        localforage.setItem('offlineData', $scope.offlineData);
      } else {
        console.log('normal operation');
      }
    };

    $scope.isLocalForageEmpty = function() {
      localforage.keys(function(err, numberOfKeys) {
        if (numberOfKeys.length > 0) {
          return false;
        } else {
          return true;
        }
      });
    };


    $scope.isOffline = function() {
      $scope.showTable = ($scope.offlineData.length > 0 || $scope.isLocalForageEmpty()) ? true : false;

      if ($scope.networkStatus === 'offline') {
        document.getElementById("syncButton").setAttribute("style", "background-color: #808080; border-style: none;");
        return true;
      }
      if ($scope.networkStatus === 'online') {
        document.getElementById("syncButton").setAttribute("style", "background-color: none;");
      }
    };

    // get Stored item on new page load if any
    localforage.getItem("offlineData").then(function(value) {
      if (value) {
        $scope.offlineData = value;
      }
    });

    $scope.syncOfflineData = function() {
      console.log('SENDING DATA TO BACKEND.....');
      //TODO: INCOPORATE BACKEND LOGIC
      while ($scope.offlineData.length > 0) {
        $scope.offlineData.pop();
      }
      localforage.clear();
      $scope.showTable = false;
    };

    // TODO: Can still be necessary for use with  mobile.
    CordovaNetworkAsync.isOnline().then(function(isOnline) {
      if (isOnline) {
        console.log('you are online');
      } else {
        console.log('you are offline');
      }
    }).catch(function(err) {
      console.log(err);
    });

    //Testing LocalForage service

    // LocalForage.set('testdata', 'chibz and kenny');
    LocalForage.get('testdata').then(function(data) {
      console.log(data);
    });


    LocalForage.lengthOfData('testdata').then(function(data) {
      console.log(data);
    });

    $scope.balance = 5000; // this is will be pulled from the backend.  
    $scope.$watch('amountCharged', function(newVal, oldVal) {
      if (newVal > oldVal) {
        $scope.balance += parseInt(oldVal, 10); // add back the old value
        $scope.balance -= parseInt(newVal, 10); // then rempove the new value
      } else {
        if (newVal === '0') {
          $scope.balance += parseInt(oldVal, 10);
        } else {
          $scope.balance += parseInt(oldVal, 10) - parseInt(newVal, 10);
        }
      }
    });
  }
]);