(function () {

	var viewController = function ($scope, $timeout, monitorHttp) {

		var antiFlickerDelay = monitorHttp.config().delay;
		
		console.log('in view controller');
    	$scope.coveritup = false;

    	// to prevent flickers, delay turning off the coverup a short time
    	// if another request comes in, cancel the turning off to leave it on.
    	var turnOffPromise = null;

    	// to prevent flickers, delay turning on the coverup a short time
    	// if the request comes back, cancel the turning on to leave it off.
    	var turnOnPromise  = null;
    	
    	$scope.$watch(
    			function () { return monitorHttp.numOutstandingRequests() > 0; },
    			function ( hasOutstanding ) {

    				if ( hasOutstanding ) {
    					if ( turnOnPromise )
    						$timeout.cancel(turnOnPromise);
    					turnOnPromise = $timeout( function () {
    						$scope.coveritup = true;
    					},
    					antiFlickerDelay);
    				}
    				
    				else {
    					if ( turnOffPromise )
    						$timeout.cancel(turnOffPromise);

    					turnOffPromise = $timeout( function () {
    						$scope.coveritup = false;
    					},
    					antiFlickerDelay);
    				}
    			}
    	);

	};

    angular.module('customersApp')
    .controller('ViewController', ['$scope', '$timeout', 'monitorHttp', viewController]);

}());
