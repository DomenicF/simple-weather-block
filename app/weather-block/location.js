export default class Location {
	constructor() {
		this.requestDone = false;
	}

	getLocation(location) {
		// create a new XMLHttpRequest
		var xhr = new XMLHttpRequest()

		// get a callback when the server responds
		xhr.addEventListener('load', () => {
		  // update the state of the component with the result here
		  console.log(xhr.responseText)
		  this.requestDone = true;
		})
		// open the request with the verb and the url
		xhr.open('GET', window.location.protocol + '//' + window.location.hostname + '/swb_location?location=' + location)
		// send the request
		xhr.send()
	}
}
