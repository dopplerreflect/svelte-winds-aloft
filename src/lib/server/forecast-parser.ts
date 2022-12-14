import { N_HRS, MONTHS } from '$lib/constants';

export const parseForecastText = (text: string) => {
	return [...text.split('\n\n')].slice(0, N_HRS).map((forecastText) => {
		const [header, _info, _capecin, _sid, _sounding, _sid_other, _surface, _mandatory, ...rest] =
			forecastText.split('\n').map((t) => t.replace(/^[ ]+/, ''));

		let info = parseInfo(_info);
		let [, cape, , cin] = _capecin.split(/[\s]+/);
		let [, latlon] = _sid_other.split(/[\s]+/);
		let [type, pressure, height, temp, dewpt, direction, speed] = _surface
			.split(/[\s]+/)
			.map((v) => Number(v));
		let surface = { height, temp: temp / 10, dewpt: dewpt / 10, direction, speed };

		let soundings = [
			surface,
			...rest.map((t) => {
				let [type, pressure, height, temp, dewpt, direction, speed] = t
					.split(/[\s]+/)
					.map((v) => Number(v));
				return { height, temp: temp / 10, dewpt: dewpt / 10, direction, speed };
			})
		];
		return {
			header,
			_info,
			info,
			latlon,
			_capecin,
			cape,
			cin,
			_sid,
			_sounding,
			_sid_other,
			_surface,
			_mandatory,
			soundings
		};
	});
};

function parseInfo(s: string) {
	const [type, hour, day, month, year] = s.split(/[\s]+/);
	return {
		type,
		hour: Number(hour),
		day: Number(day),
		month: Number(MONTHS.get(month)!),
		year: Number(year)
	};
}
