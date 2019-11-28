<?php

function darksky_rewrite_rule() {
	add_rewrite_rule(
		'darksky/?$',
		'index.php',
		'top'
	);
}
add_action( 'init', 'darksky_rewrite_rule' );

function darksky_route() {
	global $wp, $wp_rewrite;

	if ( $wp->matched_rule == 'darksky/?$' ) {
		include 'proxy.php';
		exit();
	}
}
add_action( 'template_redirect', 'darksky_route' );

function location_search_rewrite_rule() {
	add_rewrite_rule(
		'swb_location/?$',
		'index.php',
		'top'
	);
}
add_action( 'init', 'location_search_rewrite_rule' );

function location_search_route() {
	global $wp, $wp_rewrite;

	if ( $wp->matched_rule == 'swb_location/?$' ) {
		if ( isset( $_GET['location'] ) ) {
			$location = new SWBLocation( $_GET['location'] );
			print_r( $location->get_results() );
			exit();
		}
	}
}
add_action( 'template_redirect', 'location_search_route' );
