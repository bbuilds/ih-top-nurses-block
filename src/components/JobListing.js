/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

export default function JobListing({ title, url, location, salary }) {
	return (
		<div className="ih-nurse-listing">
			<h3>
				🏥 <a href={url}>{title}</a>
			</h3>
			<p>
				<span className="ih-nurse-listing__location">{location}</span> |{" "}
				<span className="ih-nurse-listing__salary">{salary}</span>
			</p>
		</div>
	);
}
