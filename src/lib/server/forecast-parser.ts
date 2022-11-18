export const parseForecastText = (text: string) => {
	return [...text.split('\n\n')].map((forecastText) => {
		const [header, info, capecin, sid, sounding, sid_other, surface, mandatory, ...rest] =
			forecastText.split('\n').map((t) => t.replace(/^[ ]+/, ''));

		const forecast = rest.map((t) => {
			const [type, pressure, height, temp, dewpt, direction, speed] = t.split(/[\s]+/);
			return { height, temp, dewpt, direction, speed };
		});
		return { header, info, capecin, sid, sounding, sid_other, surface, mandatory, forecast };
	});
};
