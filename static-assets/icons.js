"use strict";

var iconElement = document.getElementById('weather-icon');

var skycons = new Skycons({ 'color': '#9b1518' });
	skycons.add(iconElement, iconElement.dataset.weatherIcon);
	skycons.play();
