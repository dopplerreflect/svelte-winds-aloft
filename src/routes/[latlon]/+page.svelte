<script type="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	$: forecastHours = [...data.text.split('\n\n')].map((forecastText) => {
		const [header, info, capecin, sid, sounding, sid_other, surface, mandatory, ...rest] =
			forecastText.split('\n').map((t) => t.replace(/^[ ]+/, ''));

		const forecast = rest.map((t) => {
			const [type, pressure, height, temp, dewpt, direction, speed] = t.split(/[\s]+/);
			return { height, temp, dewpt, direction, speed };
		});
		return { header, info, capecin, sid, sounding, sid_other, surface, mandatory, forecast };
	});
</script>

<div>
	<code>{JSON.stringify(data, null, 2)}</code>
</div>

<div class="grey">
	<code>{JSON.stringify(forecastHours, null, 2)}</code>
</div>
<div>
	<code>{data.text}</code>
</div>

<style>
	code {
		white-space: pre;
	}
	.grey {
		background-color: lightgray;
	}
</style>
