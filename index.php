<?php
/**
 * Plugin Name: Simple Weather Block
 * Description: A simple weather block.
 * Version: 0.1
 * Author: Domenic Fiore
 * Author URI: https://github.com/DomenicF
 * Text Domain: simple-weather-block
 */

define( 'SWB_PLUGIN_URL', __FILE__ );
require 'enqueue.php';
require 'classes/Location.php';
require 'rewrite-rules.php';


add_action( 'enqueue_block_editor_assets', 'swb_enqueue_block_editor_assets' );
add_action( 'enqueue_block_assets', 'swb_enqueue_block_assets' );
