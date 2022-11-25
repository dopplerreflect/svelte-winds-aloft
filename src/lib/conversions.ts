export const celsiusToFarenheit = (value: number) => ((value * 9) / 5 + 32).toFixed(1);

export const metersToFeet = (value: number) => Math.round(value * 3.281);

export const knotsToMph = (value: number) => Math.round(value * 1.151);

export const toLocalTime = (year: number, month: number, day: number, hour: number) => {
	return new Date(Date.UTC(year, month - 1, day, hour, 0, 0)).toLocaleString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		timeZoneName: 'short'
	});
};
