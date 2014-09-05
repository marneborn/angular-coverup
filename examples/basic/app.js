var app = angular.module('myApp', [
                                   'mngCoverup'
                                   ]
)

.controller('myCtrl', function ($scope) {
	$scope.select = 0;
	$scope.incrToggle = function () {
		$scope.select++;
		if ( $scope.select > 20 )
			$scope.select = 0;
	}
});