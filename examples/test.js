(function () {
	"use strict";

	document.querySelector('button').addEventListener('click', function () {
		twoway.scope.input = 'You clicked the button!';
	});

	twoway.bind(document.getElementById("bindme"), [{
		property: "text",
		variable: "input"
	}]);
})();
