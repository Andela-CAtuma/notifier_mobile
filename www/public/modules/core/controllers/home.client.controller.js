'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$http',
  function($scope, Authentication, $http) {
    $scope.place_report = '';
    $scope.authentication = Authentication;
    $scope.map;
    $scope.markers = [];
    $scope.cords;
    $scope.search_city = '';
    $scope.place_info = '';
    $scope.present_location = {
      k: '',
      D: ''
    };

    var initialize = function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          $scope.cords = position.coords;
          $scope.present_location.k = position.coords.latitude;
          $scope.present_location.D = position.coords.longitude;
          $('#frame').html('<iframe id="forecast_embed" type="text/html" frameborder="0" height="245" width="100%" src="//forecast.io/embed/#lat=' + $scope.present_location.k + '&lon=' + $scope.present_location.D + '"> </iframe>');
          var currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          var mapOptions = {
            zoom: 12,
            center: currentLocation,
            mapTypeId: google.maps.MapTypeId.TERRAIN
          };
          $scope.map = new google.maps.Map(document.getElementById('map'),
            mapOptions);
          get_weather(position.coords.latitude, position.coords.longitude);
          google.maps.event.addListener($scope.map, 'click', function(event) {
            $scope.present_location = event.latLng;
            deleteMarkers();
            $('#frame').html('<iframe id="forecast_embed" type="text/html" frameborder="0" height="245" width="100%" src="//forecast.io/embed/#lat=' + event.latLng.k + '&lon=' + event.latLng.D + '"> </iframe>');
            addMarker(event.latLng);
            get_weather(event.latLng.k, event.latLng.D);
          });
          addMarker(currentLocation);
        });
      } else {

      }
    };
    initialize();

    function addMarker(location) {
      var marker = new google.maps.Marker({
        position: location,
        map: $scope.map,
        animation: google.maps.Animation.DROP
      });
      $scope.markers.push(marker);
    };

    var setAllMap = function(map) {
      for (var i = 0; i < $scope.markers.length; i++) {
        $scope.markers[i].setMap(map);
      }
    }

    function clearMarkers() {
      setAllMap(null);
    };

    var deleteMarkers = function() {
      clearMarkers();
      $scope.markers = [];
    };

    var get_weather = function(val1, val2) {
      var forecast_url = "https://api.forecast.io/forecast/761080e4acfe83e078084db199ffe7c3/" + val1 + "," + val2;
      var forecast_url_config = {
        params: {
          callback: "JSON_CALLBACK"
        }
      };
      $http.jsonp(forecast_url, forecast_url_config).success(function(data) {
        $scope.place_report = data;
      });
    };
  }
]);
