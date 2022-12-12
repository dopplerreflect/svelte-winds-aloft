import { error } from '@sveltejs/kit';
import { parseForecastText } from '$lib/server/forecast-parser';
import { N_HRS } from '$lib/constants';

export const fetchWindsAloftForecasts = async (lat: string, lon: string) => {
	const queryParams = {
		data_source: 'Op40',
		fcst_len: 'shortest',
		startSecs: Math.round(Date.now() / 1000) - 3600,
		endSecs: Math.round(Date.now() / 1000) - 3600 + 60 * 60 * N_HRS,
		n_hrs: N_HRS,
		airport: [lat, lon].join()
	};

	const queryString = Object.entries(queryParams)
		.map((pair) => pair.join('='))
		.join('&');

	const url = `https://rucsoundings.noaa.gov/get_soundings.cgi?${queryString}`;

	try {
		const result = await fetch(url);
		const text = await result.text();
		const forecasts = parseForecastText(text);
		return forecasts;
	} catch (err) {
		throw error(500, {
			message: 'Could not fetch winds aloft data. Are we online?'
		});
	}
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
