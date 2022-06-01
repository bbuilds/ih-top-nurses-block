/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

//Job List Component
import JobListing from "./components/JobListing";

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

const FILTERS_END_POINT = "ih/v1/filters";
const JOBS_END_POINT = "ih/v1/jobs";

//Grabbing info form rest API
async function fetchAndSetFilters(setAttributes) {
	try {
		const response = await apiFetch({ path: FILTERS_END_POINT });

		response.states.unshift({
			label: __("Select a State", "ih-top-nurse-jobs"),
			value: "ZZ",
		});

		response.specialties.unshift({
			label: __("Select a Specialty.", "ih-top-nurse-jobs"),
			value: "ZZ",
		});

		setAttributes({
			filterStates: response.states,
			filterSpecalities: response.specialties,
		});
	} catch (e) {
		console.error("Oh no, there is an error!", { error: e });
		setAttributes({ filterStates: [], filterSpecalities: [] });
	}
}

//Grabbing info form rest API
async function fetchAndSetJobListings(
	selectedFilterState,
	selectedFilterSpecialty,
	setAttributes
) {
	function buildFetchUrl() {
		let fetchURL = JOBS_END_POINT;

		if (
			selectedFilterState &&
			selectedFilterSpecialty &&
			selectedFilterState !== "ZZ" &&
			selectedFilterSpecialty !== "ZZ"
		) {
			fetchURL = `${JOBS_END_POINT}?state=${selectedFilterState}&speciality=${selectedFilterSpecialty}`;
		} else if (selectedFilterState && selectedFilterState !== "ZZ") {
			fetchURL = `${JOBS_END_POINT}?state=${selectedFilterState}`;
		} else if (selectedFilterSpecialty && selectedFilterSpecialty !== "ZZ") {
			fetchURL = `${JOBS_END_POINT}?speciality=${selectedFilterSpecialty}`;
		}

		return fetchURL;
	}

	try {
		const response = await apiFetch({ path: buildFetchUrl() });
		setAttributes({ jobListings: response.jobs, isLoading: false });
	} catch (e) {
		console.error("Oh no, there is an error!", { error: e });
		setAttributes({ jobListings: [] });
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
		selectedFilterSpecialty,
		jobListings,
		isLoading,
	} = attributes;

	useEffect(() => {
		fetchAndSetFilters(setAttributes);
	}, []);

	useEffect(() => {
		fetchAndSetJobListings(
			selectedFilterState,
			selectedFilterSpecialty,
			setAttributes
		);
	}, [selectedFilterState, selectedFilterSpecialty]);

	function RenderJobs(jobs) {
		console.log("jobs", jobs);
		if (jobs && jobs.length > 0) {
			<ul>
				{jobs.map(function (job, i) {
					return <li key={i}>{job.title}</li>;
				})}
			</ul>;
		} else {
			return <p>Sorry no postings match your criteria.</p>;
		}
	}
	console.log("jobListings", jobListings);
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
						value={selectedFilterSpecialty}
						options={filterSpecalities}
						onChange={(newSpecialty) => {
							setAttributes({
								selectedFilterSpecialty: newSpecialty,
							});
						}}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...useBlockProps()}>
				{isLoading && jobListings ? (
					<Spinner />
				) : (
					<ul id="ih-top-nurse-listings" className="ih-nurse-list">
						{jobListings &&
							jobListings.map((job, index) => {
								return (
									<li key={index} className="ih-nurse-list__item">
										<JobListing
											title={job.title}
											url={job.url}
											location={job.location}
										/>
									</li>
								);
							})}
					</ul>
				)}
			</div>
		</>
	);
}
