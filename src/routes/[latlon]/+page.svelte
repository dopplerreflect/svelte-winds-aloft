<script type="ts">
	import type { PageData } from './$types';
	import { metersToFeet, knotsToMph, toLocalTime, celsiusToFarenheit } from '$lib/conversions';

	export let data: PageData;

	let useFeet = true;
	let useMph = true;
	let useFarenheit = true;
	let filter16k = true;

	$: heightLabel = useFeet ? 'ft' : 'm';
	$: speedLabel = useMph ? 'mph' : 'kts';
	$: temperatureLabel = useFarenheit ? '°F' : '°C';
</script>

<header>
	<label for="useFeet">Use Feet</label>
	<input id="useFeet" type="checkbox" bind:checked={useFeet} />
	<label for="useMph">Use MPH</label>
	<input id="useMph" type="checkbox" bind:checked={useMph} />
	<label for="useFarenheit">Use °F</label>
	<input id="useFarenheit" type="checkbox" bind:checked={useFarenheit} />
	<label for="filter16k">Filter 16k</label>
	<input id="filter16k" type="checkbox" bind:checked={filter16k} />
</header>
<div>Ground elevation: {useFeet ? metersToFeet(data.alt) : data.alt}</div>
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
			</div>
			<div class="capecin">CAPE: {forecast.cape} CIN: {forecast.cin}</div>
			{#each forecast.soundings.filter((s) => (filter16k ? s.height < 4877 : s)) as sounding}
				<div class="grid-container inner">
					<div class="height">
						{useFeet ? metersToFeet(sounding.height - data.alt) : sounding.height - data.alt}
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
