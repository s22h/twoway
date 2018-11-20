import Twoway from "../src/twoway.js"

const twoway = new Twoway();

document.querySelector("button").addEventListener("click", () => {
	twoway.dataStore.input = "You clicked the button!";
});

twoway.bind(document.getElementById("bindme"), ["text:input"]);
