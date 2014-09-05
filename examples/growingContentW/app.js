var app = angular.module('myApp', [
                                   'mngCoverup'
                                   ]
)

.controller('myCtrl', function ($scope, $http, $interval) {
	$scope.select = 0;
	$scope.incrToggle = function () {
		$scope.select++;
		if ( $scope.select > 1 )
			$scope.select = 0;
	}

	$scope.line = '0';
	var i = 0;
	$interval( function () {
		i++;
		$scope.line += ','+i*1000;
	},
	500);
});