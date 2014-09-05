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

	$scope.lines = [];
	var i = 0;
	$interval( function () {
		i++;
		$scope.lines.push('line '+i);
	},
	500);
});