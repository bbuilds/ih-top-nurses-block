<?php

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

//add menu page
add_action( 'admin_menu', 'ih_create_menu_page' );
function ih_create_menu_page() {
	add_menu_page(
		__( 'IH Top Nurse Job Settings', 'ih-top-nurse-jobs' ),
		__( 'IH Jobs Block Settings', 'ih-top-nurse-jobs' ),
		'administrator',
		'ih-top-nurse-jobs-settings',
		'ih_plugin_settings_page',
		'dashicons-admin-site',
		25
	);
}

//register API URL settings
add_action( 'admin_init', 'register_ih_plugin_settings' );
function register_ih_plugin_settings() {
	register_setting( 'ih_top_nurse_jobs_settings', 'ih_top_nurse_jobs_api_list' );
	register_setting( 'ih_top_nurse_jobs_settings', 'ih_top_nurse_jobs_api_filters' );
}


function ih_plugin_settings_page() {
	?>
	<div class="wrap">
	<h1>IH Salary Map Settings</h1>

	<form method="post" action="options.php">
		<?php settings_fields( 'ih_top_nurse_jobs_settings' ); ?>
		<?php do_settings_sections( 'ih_top_nurse_jobs_settings' ); ?>
		<table class="form-table">
			<tr valign="top">
			<th scope="row">Base jobs list API URL</th>
			<td><input type="text" name="ih_top_nurse_jobs_api_list" value="<?php echo esc_attr( get_option('ih_top_nurse_jobs_api_list') ); ?>" /></td>
			</tr>

			<tr valign="top">
			<th scope="row">Salary Filters API URL</th>
			<td><input type="text" name="ih_top_nurse_jobs_api_filters" value="<?php echo esc_attr( get_option('ih_top_nurse_jobs_api_filters') ); ?>" /></td>
			</tr>
		</table>
		<?php submit_button(); ?>
	</form>
	</div>
<?php } ?>
