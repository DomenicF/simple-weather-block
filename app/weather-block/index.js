import { debounce } from 'debounce';

const { registerBlockType }         =   wp.blocks;
const { __ }						=   wp.i18n;
const { InspectorControls, BlockControls, AlignmentToolbar, BlockAlignmentToolbar } = wp.editor;
const { PanelBody, PanelRow, TextControl, SelectControl, Button } = wp.components;

import Location from './location';
const location = new Location();
location.getLocation('boston, ma');
import Darksky from 'darkskyjs';
const darkSky = new Darksky({ PROXY_SCRIPT: window.location.protocol + '//' + window.location.hostname + "/darksky" });
// const data = darkSky.getCurrentConditions([{latitude: 37.8267, longitude: -122.4233, name: 'Canton'}], function (ok) {
// 	console.log(ok[0].apparentTemperature())
// });


registerBlockType( 'domenicf/simple-weather-block', {
	title:								__( 'Simple Weather Block', 'simple-weather-block' ),
	description:						__( 'Easily get the weather based on a zip code and display it in a nice format.', 'simple-weather-block' ),
	category:							__( 'common' ),
	icon:								'palmtree',
	attributes: {
		location: {
			type: 'string',
			default: '02109'
		},
		location_options: {
			type: 'array',
			default: [{ value: 'search', label: 'Search for a location first.' }]
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
		location_name: {
			type: 'string',
			default: ''
		}
	},
	edit: props => {
		let weatherResult = (latitude, longitude) => {

			darkSky.getCurrentConditions([{latitude, longitude, name: props.attributes.set_location}], function (data) {
				props.setAttributes({ temperature: data[0].temperature().toString() });
			});

		}

		return [
			<InspectorControls>
				<PanelBody title={ __( 'Location', 'simple-weather-block' ) }>
					<PanelRow>
						<p>{ __( 'Set the location here.' ) }</p>
					</PanelRow>
					<TextControl
						label={ __( 'Location', 'simple-weather-block' ) }
						help={ __( 'Enter the location for the place where you want the weather to be displayed.', 'simple-weather-block' )}
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
							console.log(location_options);
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
				<p>
					{props.attributes.temperature.length > 0 && 'The current temperature as of this post is ' + props.attributes.temperature + ' in ' + props.attributes.set_location + '.'}
				</p>
			</div>
		];
	},
	save: props => {
		return (
			<div className={ props.className }>
				<p>
					{props.attributes.temperature.length > 0 && 'The current temperature as of this post is ' + props.attributes.temperature + ' in ' + props.attributes.set_location + '.'}
				</p>
			</div>
		);
	}
});
