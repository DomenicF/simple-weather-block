const { registerBlockType }         =   wp.blocks;
const { __ }						=   wp.i18n;
const { InspectorControls, RichText, RawHTML, BlockControls, AlignmentToolbar, BlockAlignmentToolbar } = wp.blockEditor;
const { PanelBody, PanelRow, TextControl, SelectControl, Button } = wp.components;

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
		message: {
			type: 'string',
			default: '<p>Hello</p>'
		}
	},
	edit: props => {
		let weatherResult = (latitude, longitude) => {

			darkSky.getCurrentConditions([{ latitude, longitude, name: props.attributes.set_location }], function ( data ) {
				props.setAttributes({ temperature: data[0].temperature().toString() });
				props.setAttributes({ icon: data[0].icon() });
				props.setAttributes({ summary: data[0].summary() });

				let message = `<p>
									<canvas data-weather-icon="${props.attributes.icon}" id="weather-icon" width="128" height="128"></canvas>
									<p>
										The current temperature as of this post is ${props.attributes.temperature}° F in ${props.attributes.location}.
									</p>
								</p>`;

				props.setAttributes({ message });
			});

		}


		skyconsInstance.add(document.getElementById('weather-icon'), props.attributes.icon);
		skyconsInstance.play();

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
						onChange={ new_val => {
							let lat_lon = new_val.split(',');
							props.setAttributes({ set_location: new_val, latitude: lat_lon[0], longitude: lat_lon[1] });
							weatherResult(lat_lon[0], lat_lon[1]);
						} }
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
