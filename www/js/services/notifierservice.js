angular.module('starter.controllers')
.factory('Notifiers', ['$resource',
	function($resource) {
		return $resource('notifiers/:notifierId', { notifierId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
