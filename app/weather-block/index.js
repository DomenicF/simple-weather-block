const { registerBlockType }         =   wp.blocks;
const { __ }						=   wp.i18n;
const { InspectorControls, RichText, RawHTML, BlockControls, AlignmentToolbar, BlockAlignmentToolbar } = wp.blockEditor;
const { PanelBody, PanelRow, TextControl, SelectControl, Button, ToggleControl } = wp.components;
const { useEffect } = wp.element;

import Location from './location';
import Darksky from 'darkskyjs';
const Skycons = require('skycons')(window);
let skyconsInstance = new Skycons({ 'color': '#9b1518' });
const location = new Location();
const darkSky = new Darksky({ PROXY_SCRIPT: window.location.protocol + '//' + window.location.hostname + "/darksky" });

import '../main.scss';


registerBlockType( 'domenicf/simple-weather-block', {
	title:								__( 'Simple Weather Block', 'simple-weather-block' ),
	description:						__( 'Easily get the weather based on a given location and display it in a nice format.', 'simple-weather-block' ),
	category:							__( 'common' ),
	icon:								'palmtree',
	attributes: {
		location: {
			type: 'string',
			default: 'Boston, MA'
		},
		location_options: {
			type: 'array',
			default: [{ value: 'search', label: __( 'Search for a location first.' ) }]
		},
		set_location: {
			type: 'string',
			default: '02109'
		},
		latitude: {
			type: 'string'
		},
		longitude: {
			type: 'string'
		},
		temperature: {
			type: 'string',
			default: ''
		},
		summary: {
			type: 'string',
			default: ''
		},
		location_name: {
			type: 'string',
			default: ''
		},
		icon: {
			type: 'string',
			default: ''
		},
		icon_added: {
			type: 'boolean',
			default: false
		},
		message: {
			type: 'string',
			default: '<p>Hello</p>'
		},
		apparent_temperature_enabled: {
			type: 'boolean',
			default: false
		},
		apparent_temperature: {
			type: 'string',
			default: ''
		}
	},
	edit: props => {
		let weatherResult = (latitude, longitude) => {

			darkSky.getCurrentConditions([{ latitude, longitude, name: props.attributes.set_location }], function ( data ) {
				props.setAttributes({ temperature: data[0].temperature().toString() });
				props.setAttributes({ icon: data[0].icon() });
				props.setAttributes({ summary: data[0].summary() });
				props.setAttributes({ apparent_temperature: data[0].apparentTemperature().toString() });

				defineMessage(data[0].temperature().toString(), data[0].icon(), data[0].apparentTemperature().toString());
			});
		}

		let defineMessage = (temp, icon, apparent_temperature) => {
			let message = '<p>';
				message += `		<canvas data-weather-icon="${icon}" id="weather-icon" width="128" height="128"></canvas>
									<p>
										The current temperature as of this post is ${temp}° F in ${props.attributes.location}.
									</p>
								`;
				props.attributes.apparent_temperature_enabled ? message += `<p>
																The apparent temperature is ${props.attributes.apparent_temperature}° F.
															</p>` : '';
				message += '</p>';

				props.setAttributes({ message });

				if ( ! props.attributes.icon_added ) {
					skyconsInstance.add(document.getElementById('weather-icon'), icon);
					props.setAttributes({ icon_added: true });
				} else {
					skyconsInstance.set(document.getElementById('weather-icon'), icon);
				}

				skyconsInstance.play();
		};

		let selectChange = new_val => {
			let lat_lon = new_val.split(',');
			props.setAttributes({ set_location: new_val, latitude: lat_lon[0], longitude: lat_lon[1] });
			weatherResult(lat_lon[0], lat_lon[1]);
		};


		return [
			<InspectorControls>
				<PanelBody title={ __( 'Location', 'simple-weather-block' ) }>
					<PanelRow>
						<p>{ __( 'Set the location here.' ) }</p>
					</PanelRow>
					<TextControl
						label={ __( 'Location', 'simple-weather-block' ) }
						help={ __( 'Enter the location for the place where you want the weather to be displayed. This will also be used as the location label inside the block.', 'simple-weather-block' )}
						value={ props.attributes.location }
						onChange={ new_val => {
							props.setAttributes( { location: new_val } )
						}}
					/>
					<Button isDefault onClick={() => {
						location.getLocation(props.attributes.location).then(response => {
							let location_options = [{ value: '', label: 'Success! Choose from a location.' }];
							response.data.forEach(element => {
								location_options.push({
									label: element.display_name,
									value: element.lat + ',' + element.lon,
								});
							});
							props.setAttributes({ location_options });
						});
					}}>Search</Button>
					<SelectControl
						label={ __( 'Location', 'simple-weather-block' ) }
						help={ __( 'Choose from a list of possible locations.', 'simple-weather-block' ) }
						value={ props.attributes.set_location }
						options={ props.attributes.location_options }
						onChange={ selectChange }
					/>
				</PanelBody>
			</InspectorControls>,
			<InspectorControls>
				<PanelBody title={ __('Optional Features', 'simple-weather-block') }>
					<PanelRow>
						<p> { __('Select your optional features here.', 'simple-weather-block') }</p>
					</PanelRow>

					<ToggleControl
						label="Apparent Temperature"
						checked={ props.attributes.apparent_temperature_enabled }
						onChange={ () => { props.setAttributes({ apparent_temperature_enabled: ! props.attributes.apparent_temperature_enabled }) } }
					/>


				</PanelBody>
			</InspectorControls>,
			<div className={ props.className }>
				<RichText
					tagName="div"
					multiline="p"
					onChange={ new_val => {
						props.setAttributes({ message: new_val });
					}}
					value={ props.attributes.message } />
			</div>
		];
	},
	save: props => {
		return (
			<div className={ props.className }>
				<RichText.Content tagName="div" value={props.attributes.message} />
			</div>
		);
	}
});
