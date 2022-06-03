/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { useBlockProps, RichText, InnerBlocks } from "@wordpress/block-editor";

//Job List Component
import JobListing from "./components/JobListing";

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function save({ attributes }) {
	const { jobListings, blockTitle } = attributes;
	return (
		<div {...useBlockProps.save()}>
			{blockTitle && <RichText.Content tagName="h2" value={blockTitle} />}

			<ul id="ih-top-nurse-listings" className="ih-top-nurses-block-list">
				{jobListings &&
					jobListings.map((job, index) => {
						return (
							<li key={index} className="ih-top-nurses-block-list__item">
								<JobListing
									title={job.title}
									url={job.url}
									location={job.location}
									salary={job.salary}
								/>
							</li>
						);
					})}
			</ul>
			<div class="ih-top-nurses-block-list__content">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
