import type { PageServerLoad } from './$types';
import { parseForecastText } from '../../lib/server/forecast-parser';
import { N_HRS } from '$lib/constants';

export const load: PageServerLoad = async ({ params }) => {
	let [lat, lon, alt] = params.latlon.split(',').map((s) => Number(s).toFixed(4));

	if (!alt) {
		alt = '0';
	}

	const queryParams = {
		data_source: 'Op40',
		start: 'latest',
		n_hrs: N_HRS,
		airport: [lat, lon].join()
	};

	const queryString = Object.entries(queryParams)
		.map((pair) => pair.join('='))
		.join('&');

	const url = `https://rucsoundings.noaa.gov/get_soundings.cgi?${queryString}`;

	const result = await fetch(url);
	const text = await result.text();

	const forecasts = parseForecastText(text);

	return { forecasts, alt: Math.round(Number(alt)) };
};

/** from docs 
start_year=2016&
start_month_name=Jan&
start_mday=12&
start_hour=20&
start_min=0&
n_hrs=1.0& (n_hrs defaults to ‘1’)
(these will be ignored if the parameters startSecs and endSecs are present, or if “start=latest” is
present.)
*/
