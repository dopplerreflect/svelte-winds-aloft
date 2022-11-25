<script type="ts">
	import type { PageData } from './$types';
	import { metersToFeet, knotsToMph, toLocalTime } from '$lib/conversions';

	export let data: PageData;

	let useFeet = true;
	let useMph = true;
	let filter16k = true;

	$: heightLabel = useFeet ? 'ft' : 'm';
	$: speedLabel = useMph ? 'mph' : 'kts';
</script>

<header>
	<label for="useFeet">Use Feet</label>
	<input type="checkbox" bind:checked={useFeet} />
	<label for="useMph">Use MPH</label>
	<input type="checkbox" bind:checked={useMph} />
	<label for="filter16k">Filter 16k</label>
	<input type="checkbox" bind:checked={filter16k} />
</header>
<div>Ground elevation: {useFeet ? metersToFeet(data.alt) : data.alt} {heightLabel}</div>
<div class="grid-container outer">
	{#each data.forecasts as forecast}
		<div class="forecast">
			<div>{forecast.info.month} {forecast.info.day} {forecast.info.hour}:00 UTC</div>
			<div>
				Local time: {toLocalTime(
					forecast.info.year,
					forecast.info.month,
					forecast.info.day,
					forecast.info.hour
				)}
			</div>
			<div class="grid-container inner">
				{#each forecast.soundings.filter((s) => (filter16k ? s.height < 4877 : s)) as sounding}
					<div>
						{useFeet ? metersToFeet(sounding.height - data.alt) : sounding.height - data.alt}
						{heightLabel}
					</div>
					<div>
						{sounding.direction}
						<div class="arrow" style="transform:rotate({sounding.direction}deg)">&#8659;</div>
					</div>
					<div>{useMph ? knotsToMph(sounding.speed) : sounding.speed} {speedLabel}</div>
				{/each}
			</div>
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
		display: flex;
	}
	.grid-container.inner {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
	}
	.forecast {
		border-right: 1px solid black;
		padding-right: 1em;
		margin-right: 1em;
	}
	.forecast:last-child {
		border-right: none;
	}
	.arrow {
		display: inline-block;
	}
	code {
		white-space: pre;
	}
</style>
