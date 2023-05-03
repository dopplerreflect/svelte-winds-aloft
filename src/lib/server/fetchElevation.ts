export const fetchElevation = async (lat: string, lon: string) => {
	const queryStr = Object.entries({
		x: lon,
		y: lat,
		units: 'Meters'
	})
		.map((e) => e.join('='))
		.join('&');

	const url = `https://epqs.nationalmap.gov/v1/json?${queryStr}`;
	try {
		const response = await fetchWithTimeout(url, { timeout: 2000 });
		const json = await response.json();
		return Math.round(json.value);
	} catch (e) {
		console.log(e);
		return 0;
	}
};

async function fetchWithTimeout(url: string, options = { timeout: 5000 }) {
	const { timeout = 8000 } = options;

	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), timeout);

	const response = await fetch(url, { ...options, signal: controller.signal });
	clearTimeout(id);

	return response;
}
