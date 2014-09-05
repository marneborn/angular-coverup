(function () {

	var monitorHttpService = function ($q, $timeout, $window, httpInterceptor, monitorHttpConfig) {

        var queue  = [];
        var config = monitorHttpConfig.getConfig();
        
        this.numOutstandingRequests = function () {
        	return queue.length;
        };
        
        this.config = function () {
        	return config;
        }

        wireUpHttpInterceptor();
        if (window.jQuery) wirejQueryInterceptor();
        
		//Hook into httpInterceptor factory request/response/responseError functions                
		function wireUpHttpInterceptor() {
			httpInterceptor.request = function (request) {
				//I want to have a condition to not show the overlay on specific calls
				if (trackThisRequst(request))
					processRequest();
				return request || $q.when(request);
			};

			httpInterceptor.response = function (response) {
				processResponse(response);
				return response || $q.when(response);
			};

			httpInterceptor.responseError = function (rejection) {
				processResponse(rejection);
				return $q.reject(rejection);
			};
		}

		//Monitor jQuery Ajax calls in case it's used in an app
		function wirejQueryInterceptor() {
			$(document).ajaxStart(function () {
				processRequest({});
			});

			$(document).ajaxComplete(function () {
				processResponse({});
			});

			$(document).ajaxError(function () {
				processResponse({});
			});
		}

		function processRequest () {
			queue.push({});
		}

		function processResponse () {
			queue.pop();
		}

		function trackThisRequst (request) {
			var searchCriteria = {
					method: request.method,
					url: request.url
			}
			return angular.isUndefined(findUrl(config.exceptUrls, searchCriteria));
		}

		function findUrl(urlList, searchCriteria){
			var retVal = undefined;
			angular.forEach(urlList, function(url){
				if(angular.equals(url, searchCriteria)){
					retVal = true;
					return false; //break out of forEach
				}
			});
			return retVal;
		}
	}

	var httpProvider = function ($httpProvider) {
		$httpProvider.interceptors.push('httpInterceptor');
	};

	var httpInterceptor = function () {
		return {}
	};

	var monitorHttpConfig = function () {

		//default config
		var config = {
				delay: 500,
				exceptUrls: []
		};

		//set delay
		this.setDelay = function(delayTime){
			config.delay = delayTime;
		};

		//set exception urls
		this.setExceptionUrls = function(urlList){
			config.exceptUrls = urlList;
		}

		this.$get = function(){
			return {
				getDelayTime: getDelayTime,
				getExceptUrls: getExceptUrls,
				getConfig: getConfig
			};

			function getDelayTime(){
				return config.delay;
			}

			function getExceptUrls(){
				return config.exceptUrls;
			}

			function getConfig(){
				return config;
			}
		};
	}

	var module = angular.module('monitorHttp', [])

	//provider service to setup overlay configuration in the app.config
	//this will configure the delay and the APIs which you don't want to show overlay on
	.provider('monitorHttpConfig', monitorHttpConfig)

	//Empty factory to hook into $httpProvider.interceptors
	//Directive will hookup request, response, and responseError interceptors
	.factory('httpInterceptor', httpInterceptor)

	//Hook httpInterceptor factory into the $httpProvider interceptors so that we can monitor XHR calls
	.config(['$httpProvider', httpProvider])

	//Service that uses the httpInterceptor factory above to monitor XHR calls
	//When a call is made it displays an overlay and a content area 
	//No attempt has been made at this point to test on older browsers
	.service('monitorHttp', ['$q', '$timeout', '$window', 'httpInterceptor','monitorHttpConfig', monitorHttpService]);

}());