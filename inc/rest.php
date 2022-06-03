<?php

//creating IH Proxy endpoint
add_action( 'rest_api_init', function () {
	register_rest_route( 'ih/v1', '/filters', array(
		'methods'             => 'GET',
		'callback'            => 'proxy_ih_filters_api',
	) );


	register_rest_route('ih/v1', 'jobs(?:/(?P<state>\d+))?(?:/(?P<speciality>\d+))?', array(
		'methods'             => 'GET',
		'callback' => 'proxy_ih_jobs_api',
		'args' => [
			  'state',
			  'speciality'
		 ],
	  ));
} );


function proxy_ih_jobs_api($data) {
	$api_url = get_option('ih_top_nurse_jobs_api_list');
	$fetch_url = $api_url;
    $state_id = $data['state'] ?? null;
    $speciality_id = $data['speciality'] ?? null;


	$fetch_data = array('states[]' => $state_id, 'specialties[]' => $speciality_id);

	if($fetch_data) {
		$fetch_url .= '?' . http_build_query($fetch_data);
	}

	$api_response = wp_remote_get($fetch_url);

	if ( empty( $api_response ) || 200 !== $api_response['response']['code'] ) {
		return new WP_Error(
			'error',
			[
				'input'    => $data,
				'response' => $api_response,
			]
		);
	}

	return new WP_REST_Response( json_decode( $api_response['body'] ) );
}

// proxy grab data to get around CORS local dev
function proxy_ih_filters_api( $data ) {
	$api_url = get_option('ih_top_nurse_jobs_api_filters');

	$api_response = wp_remote_get($api_url);
	if ( empty( $api_response ) || 200 !== $api_response['response']['code'] ) {
		return new WP_Error(
			'error',
			[
				'input'    => $data,
				'response' => $api_response,
			]
		);
	}
	return new WP_REST_Response( json_decode( $api_response['body'] ) );
}
