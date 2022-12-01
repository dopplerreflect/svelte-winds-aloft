export const setElevation = async (lat: number, lon: number) => {
	const queryStr = Object.entries({
		x: lon,
		y: lat,
		units: 'Meters',
		output: 'json'
	})
		.map((e) => e.join('='))
		.join('&');

	const url = `https://nationalmap.gov/epqs/pqs.php?${queryStr}`;
	const response = await fetch(url);
	const json = await response.json();
	return json.USGS_Elevation_Point_Query_Service.Elevation_Query.Elevation;
};
