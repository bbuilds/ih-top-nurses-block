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
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";

/**
 * @see https://developer.wordpress.org/block-editor/reference-guides/components/spinner/
 * @see https://developer.wordpress.org/block-editor/reference-guides/components/panel/
 * @see https://developer.wordpress.org/block-editor/reference-guides/components/range-control/
 */

import { Spinner, PanelBody, SelectControl } from "@wordpress/components";

import { useEffect } from "@wordpress/element";

/**
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-api-fetch/
 */

import apiFetch from "@wordpress/api-fetch";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./editor.scss";

const END_POINT = "ih/v1/filters";

//Grabbing info form rest API
async function fetchAndSetResponse(setAttributes) {
	try {
		const response = await apiFetch({ path: END_POINT });
		setAttributes({
			filterStates: response.states,
			filterSpecalities: response.specialties,
		});
	} catch (e) {
		console.error("Oh no, there is an error!", { error: e });
		setAttributes({ filterStates: [], filterSpecalities: [] });
	}
}

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const {
		filterStates,
		filterSpecalities,
		selectedFilterState,
		selectedFilterSpeciality,
	} = attributes;

	useEffect(() => {
		fetchAndSetResponse(setAttributes);
	}, []);

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<SelectControl
						label={__("State", "ih-top-nurse-jobs")}
						value={selectedFilterState}
						options={filterStates}
						onChange={(newState) => {
							setAttributes({
								selectedFilterState: newState,
							});
						}}
					/>
					<SelectControl
						label={__("Specalities", "ih-top-nurse-jobs")}
						value={selectedFilterSpeciality}
						options={filterSpecalities}
						onChange={(newSpeciality) => {
							setAttributes({
								selectedFilterSpeciality: newSpeciality,
							});
						}}
					/>
				</PanelBody>
			</InspectorControls>
			<p {...useBlockProps()}>
				{__("Ih Top Nurse Jobs – hello from the editor!", "ih-top-nurse-jobs")}
			</p>
		</>
	);
}
