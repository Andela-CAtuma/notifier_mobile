angular.module('starter.controllers')
  .factory('CordovaNetworkAsync', ['$ionicPlatform', '$q',
    function($ionicPlatform, $q) {
      var Connection = window.Connection || {
        "CELL": "cellular",
        "CELL_2G": "2g",
        "CELL_3G": "3g",
        "CELL_4G": "4g",
        "ETHERNET": "ethernet",
        "NONE": "none",
        "UNKNOWN": "unknown",
        "WIFI": "wifi"
      };

      var asyncGetConnection = function() {
        var q = $q.defer();
        $ionicPlatform.ready(function() {
          if (navigator.connection) {
            q.resolve(navigator.connection);
          } else {
            //don't worry we can still resolve this one later on!
            q.resolve({
              type: 'UNKNOWN'
            });
          }
        });
        return q.promise;
      };

      return {
        isOnline: function() {
          return asyncGetConnection().then(function(networkConnection) {
            var isConnected = false;

            switch (networkConnection.type) {
              case Connection.ETHERNET:
              case Connection.WIFI:
              case Connection.CELL_2G:
              case Connection.CELL_3G:
              case Connection.CELL_4G:
              case Connection.CELL:
                isConnected = true;
                break;
              case 'UNKNOWN':
                //most browsers already support navigator.onLine
                isConnected = navigator.onLine || false;
                break;
            }
            return isConnected;
          });
        }
      };
    }
  ]);