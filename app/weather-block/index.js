const { registerBlockType }         =   wp.blocks;
const { __ }						=   wp.i18n;
const { InspectorControls, BlockControls, AlignmentToolbar, BlockAlignmentToolbar } = wp.editor;
const { PanelBody, PanelRow, TextControl, SelectControl } = wp.components;

import Location from './location';
const location = new Location();
console.log(location.getLocation('canton, ma').lat);
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
		zip_code: {
			type: 'text',
			default: '02109'
		},
		temperature: {
			type: 'text'
		}
	},
	edit: props => {
		let weatherResult = darkSky.getCurrentConditions([{latitude: 37.8267, longitude: -122.4233, name: 'Canton'}], function (ok) {
			props.setAttributes( { temperature: ok[0].apparentTemperature() } );
			console.log('saved:' + props.attributes.temperature);
		});

		return [
			<InspectorControls>
				<PanelBody title={ __( 'Location', 'simple-weather-block' ) }>
					<PanelRow>
						<p>{ __( 'Set the ZIP code here.' ) }</p>
					</PanelRow>
					<TextControl
						label={ __( 'ZIP Code', 'simple-weather-block' ) }
						help={ __( 'Enter the ZIP code for the place where you want the weather to be displayed.', 'simple-weather-block' )}
						value={ props.attributes.zip_code }
						onChange={ new_val => {
							props.setAttributes( { zip_code: new_val } )
						}}
					/>
				</PanelBody>
			</InspectorControls>,
			<div className={ props.className }>
				<p>
					{ props.attributes.temperature }
				</p>
			</div>
		];
	},
	save: props => {
		return (
		<p>
			{ props.attributes.temperature }
		</p>
		);
	}
});
