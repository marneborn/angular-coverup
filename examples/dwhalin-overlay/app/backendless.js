//mock for backendless server.

(function () {
	angular.module('customersApp')

	.config(['$provide', function($provide) {
		$provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
	}])

	.run(['$httpBackend', '$log', function($httpBackend, $log) {
		$httpBackend.whenGET('/api/dataservice/existingcustomers').after(5000).respond( function (method, url, data) {
			$log.log('finished fake '+method+' backend call: '+url);
			return [
			        200,
			        [
			         {"firstName":"JohnQ", "lastName":"Doe", "city":"Chandler", "state":"AZ"},
			         {"firstName":"JaneQ", "lastName":"Doe", "city":"Scottsdale", "state":"AZ"}
			         ],
			         {}
			        ];
		});
		$httpBackend.whenGET('/api/dataservice/newcustomers').after(4000).passThrough();
	}])

	.run(['$httpBackend', function($httpBackend) {
		// pass everything else through.
		$httpBackend.whenGET(/.*/).passThrough();
		$httpBackend.whenPOST(/.*/).passThrough();
		$httpBackend.whenDELETE(/.*/).passThrough();
		$httpBackend.whenPUT(/.*/).passThrough();
	}])

})();
