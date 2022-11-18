import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [lat, lon] = params.latlon.split(',').map((s) => Number(s).toFixed(4));
	const coords = { lat, lon };

	const now = new Date();

	const queryParams = {
		data_source: 'Op40',
		// start_year: now.getUTCFullYear(),
		// start_month_name: now.toLocaleString('default', { month: 'short' }),
		// start_mday: now.getUTCDate(),
		// start_hour: now.getUTCHours(),
		// start_min: 0,
		start: 'latest',
		n_hrs: 3,
		airport: [lat, lon].join()
	};

	const queryString = Object.entries(queryParams)
		.map((pair) => pair.join('='))
		.join('&');

	const url = `https://rucsoundings.noaa.gov/get_soundings.cgi?${queryString}`;

	// const url = `https://rucsoundings.noaa.gov/get_soundings.cgi?data_source=Op40&latest=latest&start_year=2022&start_month_name=Nov&start_mday=17&start_hour=22&start_min=0&n_hrs=1.0&fcst_len=shortest&airport=${coords.lat}%2C${coords.lon}&text=Ascii%20text%20%28GSL%20format%29&hydrometeors=false&start=latest`;

	const result = await fetch(url);
	const text = await result.text();

	return { coords, url, text };
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
