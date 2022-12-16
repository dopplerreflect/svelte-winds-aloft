export const fetchElevation = async (lat: string, lon: string) => {
	const queryStr = Object.entries({
		x: lon,
		y: lat,
		units: 'Meters',
		output: 'json'
	})
		.map((e) => e.join('='))
		.join('&');

	const url = `https://nationalmap.gov/epqs/pqs.php?${queryStr}`;
	console.log(url);
	try {
		const response = await fetch(url);
		const json = await response.json();
		return json.USGS_Elevation_Point_Query_Service.Elevation_Query.Elevation;
	} catch (e) {
		console.log(e);
		return 0;
	}
};