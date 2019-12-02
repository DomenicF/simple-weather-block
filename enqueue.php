<?php

function swb_enqueue_skycons() {
	wp_register_script(
		'swb_skycons',
		plugins_url(
			'/static-assets/skycons.js',
			SWB_PLUGIN_URL
		),
		array(),
		false,
		true
	);

	wp_enqueue_script( 'swb_skycons' );
}

function swb_enqueue_icons() {
	wp_register_script(
		'swb_icons',
		plugins_url(
			'/static-assets/icons.js',
			SWB_PLUGIN_URL
		),
		array( 'swb_skycons' ),
		filemtime( plugin_dir_path( SWB_PLUGIN_URL ) . '/static-assets/icons.js' ),
		true
	);

	wp_enqueue_script( 'swb_icons' );
}

function swb_enqueue_block_editor_assets() {
	wp_register_script(
		'swb_blocks_bundle',
		plugins_url(
			'/dist/bundle.js',
			SWB_PLUGIN_URL
		),
		array(
			'wp-i18n',
			'wp-element',
			'wp-blocks',
			'wp-components',
			'wp-editor',
			'wp-api',
		),
		filemtime( plugin_dir_path( SWB_PLUGIN_URL ) . '/dist/bundle.js' )
	);

	wp_enqueue_script( 'swb_blocks_bundle' );
}

function swb_enqueue_block_assets() {
	wp_register_style(
		'swb_block',
		plugins_url(
			'/dist/blocks-main.css',
			SWB_PLUGIN_URL
		)
	);

	wp_enqueue_style( 'swb_block' );

}
