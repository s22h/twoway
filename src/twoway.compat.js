(function () {
	"use strict";

	let twoway = {
		scope: {
			_data: {}
		},
		bind: function(element, bindProperties) {
			for (let i = 0; i < bindProperties.length; i++) {
				let bindProperty = bindProperties[i];

				if (!twoway.scope._data[bindProperty.variable]) {
					twoway.scope._data[bindProperty.variable] = {
						value: element[bindProperty.property],
						elements: []
					};
					let decl = {
						set: function (value) {
							this._data[bindProperty.variable].value = value;
							this._data[bindProperty.variable].elements.forEach(function (el) {
								switch (el.property) {
									case "html": {
										el.element.innerHTML = value;
										break;
									}
									case "text": {
										el.element.textContent = value;
										break;
									}
									default: {
										if (el.element.hasOwnProperty(el.property)) {
											el.element[el.property] = value;
										}
									}
								}
							});
						},
						get: function () {
							return this._data[bindProperty.variable].value;
						}
					};
					Object.defineProperty(twoway.scope, bindProperty.variable, decl);
				}

				twoway.scope._data[bindProperty.variable].elements.push({
					element: element,
					property: bindProperty.property
				});

				switch (bindProperty.property) {
					case "value": {
						element.addEventListener('input', function (evt) {
							let value = evt.currentTarget.value;
							twoway.scope[bindProperty.variable] = value;
						});
						break;
					}
				}
			}
		},
		bindElement: function (bindee) {
			let bindProperties = bindee.dataset.bind.split(",");
			let data = [];

			for (let i = 0; i < bindProperties.length; i++) {
				let bindProperty = bindProperties[i].split(":");

				if (bindProperty.length <= 1) {
					console.err("Malformed binding: ", bindProperties[i]);
					continue;
				}

				let elementProperty = bindProperty[0].trim();
				let variable = bindProperty[1].trim();

				data.push({
					property: elementProperty,
					variable: variable
				});
			}

			twoway.bind(bindee, data);
		}
	};

	Array.prototype.forEach.call(document.querySelectorAll('[data-bind]'), twoway.bindElement);

	window.twoway = twoway;
})();
