/**
 * 
 */

(function () {
	
	var cssTitle = "mngCoverupStyleSheet";
	
	// The zIndex to apply to the divs created.
	// This needs to be higher than the zIndex of other siblings...
	// FIXME: look at all siblings and set the zindex accordingly???
	// FIXME: along with that, add an attribute to skip zindex checking mng-coverup-clickable???
	var zIndex   = 1000;

	angular.module('mngCoverup', [])
	.config( function () {
		if ( !hasCSS() ) {
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

	})
	.directive('mngCoverup', ['$interval', function ($interval) {

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
			'<div class="mngCoverupContent"></div>'+
			'</div>',

			link : mngCoverupLink
		}        
	}]);

	function mngCoverupLink ( scope, elements, attrs ) {
		if ( scope.centered           === undefined ) scope.centered           = true;
		if ( scope.centeredHorizontal === undefined ) scope.centeredHorizontal = scope.centered;
		if ( scope.centeredVertical   === undefined ) scope.centeredVertical   = scope.centered;

		var content   = element.find('div.mngCoverupContent');
		var container = element.find('div.mngCoverupContainer');

		// Changes to either the content or the container size will make the placement change
		//   to keep the content centered.
		if ( scope.centeredVertical || scope.centeredHorizontal ) {
			scope.$watch(
					function () {
						var contentRect   = content[0].getBoundingClientRect();
						var containerRect = container[0].getBoundingClientRect();
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

	function hasCSS () {
		for (var i=0; i<document.styleSheets.length; i++) {
			if ( document.styleSheets[i].title === cssTitle) {
				return true;
			}
		}
		return false;
	}

	// move the content div to the correct place.
	function placeContent ( scope, content, container) {
		var containerRect = container[0].getBoundingClientRect();
		var contentRect   = content[0].getBoundingClientRect();

		// When centering horizontally, don't let the top edge of the content go above the container
		if ( scope.centeredHorizontal ) {
			content.css( ( contentRect.width < containerRect.width ) ?
					{ left : '50%', marginLeft : -1*contentRect.width/2 } :
					{ left : 0    , marginLeft : 0 }
			);
		}

		// When centering vertically, don't let the left edge of the content go past the container
		if ( scope.centeredVertical ) {
			content.css( ( contentRect.height < containerRect.height ) ?
					{ top : '50%', marginTop : -1*contentRect.height/2 } :
					{ top : 0    , marginTop : 0 }
			);
		}
	}

})();
