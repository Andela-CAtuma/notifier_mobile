angular.module('starter.controllers')
  .filter('Currency', ['$filter', function($filter) {
    return function(input) {
      input = parseFloat(input);
      if (input % 1 === 0) {
        input = input.toFixed(0);
      } else {
        input = input.toFixed(2);
      }
      return '' + input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
  }])
  .filter('Pin', ['$filter', function($filter) {
    return function(input) {
      return input.toString().replace(/([0-9])+/g, '*');
    };
  }]);