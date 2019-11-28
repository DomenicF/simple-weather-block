<?php

class SWBLocation {
	public $keyword;

	public function __construct($keyword)
	{
		$this->keyword = $keyword;
	}

	/**
	 * https://nominatim.org/release-docs/develop/
	 *
	 * @return false|mixed|string
	 */
	private function get_location() {
		$keyword = rawurlencode( $this->keyword );
		$results = wp_remote_get( "https://nominatim.openstreetmap.org/search/${keyword}?format=json&email=domenicfiore@gmail.com" );

		return $results['body'];
	}

	public function get_results() {
		return $this->get_location( $this->keyword );
	}
}
