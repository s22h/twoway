export default class Twoway {
	constructor()
	{
		this._data = {};
		this._setter = {};
		this.bindHtmlElements();
	}

	get dataStore()
	{
		return this._setter;
	}

	bind(element, props)
	{
		for (let i = 0; i < props.length; ++i) {
			let tmp = props[i].split(":");

			if (tmp.length <= 1) {
				console.err("Malformed binding: ", props[i]);
				continue;
			}

			let property = tmp[0].trim();
			let variable = tmp[1].trim();

			if (!this._data[variable]) {
				this._data[variable] = {
					value: element[property],
					elements: []
				}

				let decl = {
					set: (value) => {
						this._data[variable].value = value;
						this._data[variable].elements.forEach((el) => {
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
									if (el.property in el.element) {
										el.element[el.property] = value;
									}
								}
							}
						});
					},
					get: () => {
						return this._data[variable].value;
					}
				}

				Object.defineProperty(this._setter, variable, decl);
			}

			this._data[variable].elements.push({
				element: element,
				property: property
			});

			switch (property) {
				case "value": {
					element.addEventListener('input', (evt) => {
						let value = evt.currentTarget.value;
						this.dataStore[variable] = value;
					});
					break;
				}
			}
		}
	}

	bindElement(bindee)
	{
		let props = bindee.dataset.bind.split(",");
		let data = [];

		for (let i = 0; i < props.length; ++i) {
			let tmp = props[i].split(":");

			if (tmp.length <= 1) {
				console.err("Malformed binding: ", properties[i]);
				continue;
			}

			let property = tmp[0].trim();
			let variable = tmp[1].trim();

			data.push(property + ":" + variable);
		}

		this.bind(bindee, data);
	}

	bindHtmlElements()
	{
		document.querySelectorAll('[data-bind]').forEach((element) => { this.bindElement(element); });
	}
}
