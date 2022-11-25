<script type="ts">
	import type { PageData } from './$types';
	import { metersToFeet, knotsToMph, toLocalTime, celsiusToFarenheit } from '$lib/conversions';
	import ToggleSwitch from '$lib/components/ToggleSwitch.svelte';

	export let data: PageData;

	let useFeet = true;
	let useMph = true;
	let useFarenheit = true;
	let useAGL = true;
	let filter5km = true;

	$: heightLabel = useFeet ? `ft ${useAGL ? 'agl' : 'msl'}` : `m`;
	$: speedLabel = useMph ? 'mph' : 'kts';
	$: temperatureLabel = useFarenheit ? '°F' : '°C';
	$: heightAGL = useAGL ? data.alt : 0;
</script>

<header>
	<ToggleSwitch bind:checked={useFeet} label={{ on: 'feet', off: 'meters' }} />
	<ToggleSwitch bind:checked={useMph} label={{ on: 'mph', off: 'kts' }} />
	<ToggleSwitch bind:checked={useFarenheit} label={{ on: '°F', off: '°C' }} />
	<ToggleSwitch bind:checked={useAGL} label={{ on: 'agl', off: 'msl' }} />
	<ToggleSwitch bind:checked={filter5km} label={{ on: 'Max 5km', off: 'Max ∞' }} />
</header>
<div>Ground elevation: {useFeet ? metersToFeet(heightAGL) : heightAGL}</div>
<div class="grid-container outer">
	{#each data.forecasts as forecast}
		<div class="forecast">
			<div class="datetime">
				{toLocalTime(
					forecast.info.year,
					forecast.info.month,
					forecast.info.day,
					forecast.info.hour
				)}
				({forecast.info.hour} UTC)
			</div>
			<div class="capecin">CAPE: {forecast.cape} CIN: {forecast.cin}</div>
			{#each forecast.soundings.filter((s) => (filter5km ? s.height < 5000 : s)) as sounding}
				<div class="grid-container inner">
					<div class="height">
						{useFeet ? metersToFeet(sounding.height - heightAGL) : sounding.height - heightAGL}
						{heightLabel}
					</div>
					<div class="direction">
						{sounding.direction}°
						<div class="arrow" style="transform:rotate({sounding.direction}deg)">ᐁ</div>
					</div>
					<div class="speed">
						{useMph ? knotsToMph(sounding.speed) : sounding.speed}
						{speedLabel}
					</div>
					<div class="temperature">
						{Math.round(Number(useFarenheit ? celsiusToFarenheit(sounding.temp) : sounding.temp))}
						{temperatureLabel}
					</div>
				</div>
			{/each}
		</div>
	{/each}
</div>

<div>
	<code>{JSON.stringify(data.forecasts, null, 2)}</code>
</div>

<style>
	.grid-container {
		font-family: 'Courier New', Courier, monospace;
	}
	.grid-container.outer {
		width: 100vw;
		display: flex;
	}
	.grid-container.inner {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		border-bottom: 1px solid lightgray;
	}
	.grid-container.inner div {
		margin-right: 0.5em;
	}
	.forecast {
		border-left: 1px solid lightgray;
	}
	.forecast:last-child {
		border-right: 1px solid lightgray;
	}
	.datetime {
		background-color: lightblue;
	}
	.capecin {
		background-color: lightgreen;
	}
	.arrow {
		display: inline-block;
	}
	code {
		white-space: pre;
	}
</style>
