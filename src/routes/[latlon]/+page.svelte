<script type="ts">
	import type { PageData } from './$types';
	import { metersToFeet, knotsToMph, toLocalTime, celsiusToFarenheit } from '$lib/conversions';
	import ToggleSwitch from '$lib/components/ToggleSwitch.svelte';

	export let data: PageData;

	let useFeet = true;
	let useMph = true;
	let useFarenheit = true;
	let useAGL = Number(data.alt) > 0 ? true : false;
	let filter5km = true;

	$: heightLabel = useFeet ? `ft ${useAGL ? 'agl' : 'msl'}` : `m ${useAGL ? 'agl' : 'msl'}`;
	$: speedLabel = useMph ? 'mph' : 'kts';
	$: temperatureLabel = useFarenheit ? '°F' : '°C';
	$: heightAGL = useAGL ? data.alt : 0;

	function highlightInversion(fi: number, si: number): string {
		if (si > 0) {
			let forecast = data.forecasts[fi];
			let curTemp = forecast.soundings[si].temp;
			let prevTemp = forecast.soundings[si - 1].temp;
			if (curTemp >= prevTemp) return 'highlight';
		}
		return '';
	}
</script>

<header>
	<ToggleSwitch bind:checked={useFeet} label={{ on: 'feet', off: 'meters' }} />
	<ToggleSwitch
		disabled={Number(data.alt) === 0}
		bind:checked={useAGL}
		label={{ on: 'agl', off: 'msl' }}
	/>
	<ToggleSwitch bind:checked={useMph} label={{ on: 'mph', off: 'kts' }} />
	<ToggleSwitch bind:checked={useFarenheit} label={{ on: '°F', off: '°C' }} />
	<ToggleSwitch bind:checked={filter5km} label={{ on: 'Max 5km', off: 'Max ∞' }} />
</header>

<main>
	<div class="header">
		Location: {data.forecasts[0].latlon}
		Elevation: {useFeet ? metersToFeet(heightAGL) : heightAGL}{useFeet ? 'ft' : 'm'}
	</div>
	<div class="grid-container outer">
		{#each data.forecasts as forecast, fi}
			<div class="forecast">
				<time class="header datetime">
					{toLocalTime(
						forecast.info.year,
						forecast.info.month,
						forecast.info.day,
						forecast.info.hour
					)}
				</time>
				<div class="header capecin">CAPE: {forecast.cape} CIN: {forecast.cin}</div>
				<div class="grid-container inner">
					<div>{heightLabel}</div>
					<div>{speedLabel}</div>
					<div />
					<div />
					<div />
					{#each forecast.soundings.filter( (s) => (filter5km ? s.height < 5000 : s) ) as sounding, si}
						<div class="height">
							{useFeet ? metersToFeet(sounding.height - heightAGL) : sounding.height - heightAGL}
						</div>
						<div class="speed">
							{useMph ? knotsToMph(sounding.speed) : sounding.speed}
						</div>
						<div>
							<div class="arrow" style="transform:rotate({sounding.direction}deg)">ᐁ</div>
						</div>
						<div class="direction">
							{sounding.direction}°
						</div>
						<div class="temperature {highlightInversion(fi, si)}">
							{Math.round(
								Number(useFarenheit ? celsiusToFarenheit(sounding.temp) : sounding.temp)
							)}{temperatureLabel}
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</main>

<!-- <div>
	<code>{JSON.stringify(data.forecasts, null, 2)}</code>
</div> -->
<style>
	header {
		display: flex;
		justify-content: center;
		gap: 0.5em;
	}
	main {
		font-family: 'Courier New', Courier, monospace;
		margin: 1em;
	}
	main > .header {
		text-align: center;
	}
	.grid-container.outer {
		display: flex;
		justify-content: center;
		gap: 0.5em;
		flex-wrap: wrap;
	}
	.grid-container.inner {
		display: grid;
		grid-template-columns: 5em 3em 2em 4em 4em;
		padding: 0.5em 0 0.5em 0;
	}
	.grid-container.inner div {
		text-align: center;
	}
	.forecast {
		width: 20rem;
		border: 1px solid black;
	}
	time {
		display: block;
	}
	.forecast .header {
		padding: 0.25em;
		border-bottom: 1px solid black;
	}
	.direction {
		text-align: right;
	}
	.arrow {
		display: inline-block;
	}
	.temperature.highlight {
		background-color: lightgoldenrodyellow;
	}
	/* code {
		white-space: pre;
	} */
</style>
