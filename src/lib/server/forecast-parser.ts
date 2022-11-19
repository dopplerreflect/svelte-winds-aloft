export const parseForecastText = (text: string) => {
	return [...text.split('\n\n')].map((forecastText) => {
		const [header, info, capecin, sid, sounding, sid_other, surface, mandatory, ...rest] =
			forecastText.split('\n').map((t) => t.replace(/^[ ]+/, ''));

		const forecast = rest.map((t) => {
			const [type, pressure, height, temp, dewpt, direction, speed] = t
				.split(/[\s]+/)
				.map((v) => Number(v));
			return { height, temp: temp / 10, dewpt: dewpt / 10, direction, speed };
		});
		return { header, info, capecin, sid, sounding, sid_other, surface, mandatory, forecast };
	});
};
