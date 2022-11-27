<script type="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	let lat = 33.9769;
	let lon = -85.1703;
	let alt = 0;
	let status = '';
	$: latlon = [lat, lon, alt].join(',');
	$: valid = latlon.match(/^[\d]+\.[\d]+[, ]*[-]?[\d]+\.[\d]+[, \d]*/);
	$: coords = latlon
		.replace(/ /g, '')
		.split(',')
		.map((s) => Number(s).toFixed(4));

	const handleSubmit = () => {
		if (valid) {
			status = 'Fetching winds aloft data';
			goto(`/${coords.join()}`);
		}
	};

	const setElevation = async () => {
		status = 'Getting elevation';
		const queryStr = Object.entries({
			x: lon,
			y: lat,
			units: 'Meters',
			output: 'json'
		})
			.map((e) => e.join('='))
			.join('&');

		const url = `https://nationalmap.gov/epqs/pqs.php?${queryStr}`;
		const response = await fetch(url);
		const json = await response.json();
		status = '';
		return json.USGS_Elevation_Point_Query_Service.Elevation_Query.Elevation;
	};

	onMount(async () => {
		if (browser) {
			const L = await import('leaflet');
			let map = L.map('map').setView([lat, lon], 14);
			L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 19,
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			}).addTo(map);
			let marker = L.marker([lat, lon]).addTo(map);
			alt = await setElevation();
			map.on('click', async (e) => {
				lat = Number(e.latlng.lat.toFixed(4));
				lon = Number(e.latlng.lng.toFixed(4));
				alt = await setElevation();
			});
		}
	});
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
		integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
		crossorigin=""
	/>
</svelte:head>

<header>
	<form on:submit|preventDefault={handleSubmit}>
		<input
			autocomplete="off"
			class={valid ? '' : 'invalid'}
			type="text"
			id="latlon"
			bind:value={latlon}
		/>
		<button type="submit">Go</button>
		{status}
	</form>
</header>

<div id="map" />

<style>
	header {
		height: 1.5em;
	}
	#map {
		width: 100vw;
		height: calc(100vh - 2em);
		padding: 0;
	}
	form {
		position: absolute;
		z-index: 2;
		top: 0;
	}
	input.invalid {
		background-color: lightpink;
	}
</style>
