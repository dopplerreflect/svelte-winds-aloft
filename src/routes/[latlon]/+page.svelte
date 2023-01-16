<script type="ts">
	import { goto } from '$app/navigation';
	import { metersToFeet, knotsToMph, toLocalTime, celsiusToFarenheit } from '$lib/conversions';
	import ToggleSwitch from '$lib/components/ToggleSwitch.svelte';
	import ArrowIcon from '$lib/components/ArrowIcon.svelte';
	import SettingsIcon from '$lib/components/SettingsIcon.svelte';
	import CloseIcon from '$lib/components/CloseIcon.svelte';
	import DirectionArrow from '$lib/components/DirectionArrow.svelte';

	import type { PageData } from './$types';
	export let data: PageData;

	let status = '';
	let navVisible = false;
	let useFeet = true;
	let useMph = true;
	let useFarenheit = true;
	let useAGL = data.alt > 0;
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
	<button
		on:click={() => {
			goto('/');
		}}
	>
		<ArrowIcon style="transform: rotate(180deg)" />
	</button>
	<div class="centered">{status}</div>
	<button
		on:click={() => {
			navVisible = !navVisible;
		}}
	>
		{#if navVisible}
			<CloseIcon />
		{:else}
			<SettingsIcon />
		{/if}
	</button>
</header>

<nav class={navVisible ? '' : 'hidden'}>
	<ToggleSwitch bind:checked={useFeet} label={{ on: 'feet', off: 'meters' }} />
	<ToggleSwitch
		disabled={Number(data.alt) === 0}
		bind:checked={useAGL}
		label={{ on: 'agl', off: 'msl' }}
	/>
	<ToggleSwitch bind:checked={useMph} label={{ on: 'mph', off: 'kts' }} />
	<ToggleSwitch bind:checked={useFarenheit} label={{ on: '°F', off: '°C' }} />
	<ToggleSwitch bind:checked={filter5km} label={{ on: 'Max 5km', off: 'Max ∞' }} />
</nav>

<main>
	<div class="header">
		Location: {data.forecasts[0].latlon}
		Elevation: {useFeet ? metersToFeet(data.alt) : data.alt}{useFeet ? 'ft' : 'm'}
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
							{useFeet
								? metersToFeet(sounding.height - heightAGL)
								: Math.round(sounding.height - heightAGL)}
						</div>
						<div class="speed">
							{useMph ? knotsToMph(sounding.speed) : sounding.speed}
						</div>
						<div class="direction">
							<DirectionArrow style={`transform: rotate(${sounding.direction}deg`} />
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

<details>
	<summary>Raw Data</summary>
	{#each data.forecasts as forecast}
		<code>{forecast.forecastText}</code>
	{/each}
</details>

<details>
	<summary>Parsed Data</summary>
	{#each data.forecasts as forecast}
		<code>{JSON.stringify(forecast, null, 2)}</code>
	{/each}
</details>

<style>
	:root {
		--header-height: 3em;
		--border: 1px solid hsl(210, 50%, 50%);
	}
	main {
		background-color: hsl(210, 50%, 10%);
		color: white;
	}
	nav {
		display: block;
		position: fixed;
		top: var(--header-height);
		left: 0;
		z-index: 1;
		width: 100vw;
		color: white;
		background-color: hsla(210, 100%, 15%, 0.85);
	}
	nav.hidden {
		display: none;
	}
	main {
		font-family: 'Courier New', Courier, monospace;
		font-weight: bold;
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
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.forecast {
		width: 20rem;
		border: var(--border);
	}
	time {
		display: block;
	}
	.forecast .header {
		padding: 0.25em;
		border-bottom: var(--border);
	}
	.temperature.highlight {
		background-color: hsl(30, 100%, 33%);
	}
	code {
		display: block;
		white-space: pre;
	}
</style>
