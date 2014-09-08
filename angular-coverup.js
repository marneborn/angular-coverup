/**
 * 
 */

(function () {
	// Need to create some default styles, want them in a style sheet so that they can be
	// over written in the apps css file.
	var cssTitle = "mngCoverupStyleSheet";
	
	// The zIndex to apply to the divs created.
	// This needs to be higher than the zIndex of other siblings...
	// FIXME: look at all siblings and set the zindex accordingly???
	// FIXME: along with that, add an attribute to skip zindex checking mng-coverup-clickable???
	var zIndex   = 1000;

	angular.module('mngCoverup', [])
	
	.directive('mngCoverup', ['$interval', function ($interval) {
		
		if ( !hasCSS() ) addCSS();
		
		return {
			restrict     : 'EA',

			scope        : {
				centered           : '=?',
				centeredHorizontal : '=?',
				centeredVertical   : '=?'
			},

			transclude   : true,
			template    : '<div class="mngCoverupContainer">'+
			'<div class="mngCoverupBackground"></div>'+
			'<div ng-transclude class="mngCoverupContent"></div>'+
			'</div>',

			link : mngCoverupLink
		}        
	}]);

	function hasCSS () {
		for (var i=0; i<document.styleSheets.length; i++) {
			if ( document.styleSheets[i].title === cssTitle) {
				return true;
			}
		}
		return false;
	}

	function addCSS () {
		var style = document.createElement("style");
		style.type = 'text/css';
		style.title = cssTitle;

		// put at the top of the list so that things specified by the user are used.
		if (document.head.childNodes.length === 0) {
			document.head.appendChild(style);
		}
		else {
			document.head.insertBefore(style, document.head.childNodes[0]);
		}

		style.sheet.addRule(
				'.mngCoverupContainer',
				'position : absolute; '+
				'top      : 0px; '+
				'left     : 0px; '+
				'height   : 100%; '+
				'width    : 100%; '+
				'z-index  : '+zIndex+'; '+
				'display  : block; '
		);

		style.sheet.addRule(
				'.mngCoverupBackground',
				'position         : absolute; '+
				'top              : 0px; '+
				'left             : 0px; '+
				'z-index          : '+zIndex+'; '+
				'height           : 100%; '+
				'width            : 100%; '+
				'background-color : #808080; '+
				'opacity          : 0.3; '
		);

		style.sheet.addRule(
				'.mngCoverupContent',
				'position : absolute; '+
				'z-index  : '+zIndex+'; '
		);                
	}

	function mngCoverupLink ( scope, element, attrs ) {
		
		// if neither centered-horizontal nor centered-vertical, then set both to be centered (or true)
		if ( scope.centeredHorizontal === undefined && scope.centeredVertical === undefined ) {
			if ( scope.centered === undefined || scope.centered ) {
				scope.centeredHorizontal = true;
				scope.centeredVertical   = true;
			}
			else {
				scope.centeredHorizontal = false;
				scope.centeredVertical   = false;
			}
		}
		else if ( scope.centeredHorizontal === undefined ) {
			scope.centeredHorizontal = !scope.centeredVertical;			
		}
		else if ( scope.centeredVertical === undefined ) {
			scope.centeredVertical = !scope.centeredHorizontal;			
		}

		var content   = element.find('div .mngCoverupContent');
		var container = element.find('div .mngCoverupContainer');

		var divs = element.find("div");
		for (var i=0; i<divs.length; i++) {
			var el = divs[i];
			if ( el.getAttribute('class') === 'mngCoverupContent') {
				content = el;
			}
			if ( el.getAttribute('class') === 'mngCoverupContainer') {
				container = el;
			}
		};

		// Changes to either the content or the container size will make the placement change
		//   to keep the content centered.
		if ( scope.centeredVertical || scope.centeredHorizontal ) {
			scope.$watch(
					function () {
						var contentRect   = content.getBoundingClientRect();
						var containerRect = container.getBoundingClientRect();
						return containerRect.height+','+containerRect.width+'|'+contentRect.height+','+contentRect.width;
					},
					function () { placeContent(scope, content, container); }
			);
		}
		else {
			// the watch isn't added if the content isn't centered, so place here once.
			placeContent(scope, content, container);
		}		
	}


	// move the content div to the correct place.
	function placeContent ( scope, content, container) {
		
		var containerRect = container.getBoundingClientRect();
		var contentRect   = content.getBoundingClientRect();

		// When centering horizontally, don't let the top edge of the content go above the container
		if ( scope.centeredHorizontal ) {
			if ( contentRect.width < containerRect.width ) {
				content.style.left       = '50%';
				content.style.marginLeft = -1*contentRect.width/2+'px';
			}
			else {
				content.style.left       = 0;
				content.style.marginLeft = 0;				
			}
		}

		// When centering vertically, don't let the left edge of the content go past the container
		if ( scope.centeredVertical ) {
			if ( contentRect.height < containerRect.height ) {
				content.style.top        = '50%';
				content.style.marginTop  = -1*contentRect.height/2+'px';
			}
			else {
				content.style.top        = 0;
				content.style.marginTop  = 0;				
			}
		}
	}

})();
