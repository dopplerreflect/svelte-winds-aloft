import type { PageServerLoad } from './$types';
import { fetchWindsAloftForecasts } from '$lib/server/fetchWindsAloftForecasts';
import { fetchElevation } from '$lib/server/fetchElevation';

export const load: PageServerLoad = async ({ params }) => {
	let [lat, lon] = params.latlon.split(',').map((s) => Number(s).toFixed(4));

	const forecasts = await fetchWindsAloftForecasts(lat, lon);
	const alt = await fetchElevation(lat, lon);

	return { forecasts, alt };
};
