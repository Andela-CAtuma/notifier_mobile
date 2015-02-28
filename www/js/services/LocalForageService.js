angular.module('starter.controllers')
    .factory('LocalForage', ['$q', function($q) {
        var get = function(key) {
            var defer = $q.defer();
            //Get Item from local forage
            localforage.getItem(key, function(err, data) {
                if (err) {
                    defer.reject(err);
                }
                defer.resolve(data);
            });
            return defer.promise;
        };

        var set = function(key, value) {
            localforage.setItem(key, value, function() {
                console.log('successfully stored in local forage');
            });
        };

        var lengthOfData = function() {
            var deferred = $q.defer();

            localforage.length(function(err, numberOfKeys) {
                deferred.resolve(numberOfKeys);
            });

            return deferred.promise;
        };

        return {
            get: get,
            set: set,
            lengthOfData: lengthOfData
        };
    }]);