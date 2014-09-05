(function () {

	angular.module('customersApp', ['ngRoute', 'monitorHttp', 'mngCoverup'])
	.config(['$routeProvider','monitorHttpConfigProvider', function ($routeProvider, monitorHttpConfig) {

		$routeProvider
		.when('/', {
			templateUrl: '/app/views/customers.html',
			controller: 'CustomersController'
		})
		.otherwise({ redirectTo: '/' });
		
		monitorHttpConfig.setDelay(100);
		monitorHttpConfig.setExceptionUrls(
				[
				 {
					 method: 'GET',
					 url:    '/api/dataservice/existingcustomers'
				 }
				 ]
		);
	}]);
}());






