<?php

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
	return;
	// wp_register_style(
	// 	'r_blocks',
	// 	plugins_url(
	// 		'/blocks/dist/blocks-main.css',
	// 		RECIPE_PLUGIN_URL
	// 	)
	// );

	// wp_enqueue_style( 'r_blocks' );

}
