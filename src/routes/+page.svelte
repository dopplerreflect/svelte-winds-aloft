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
			await navigator.geolocation.getCurrentPosition((p) => {
				(lat = p.coords.latitude), (lon = p.coords.longitude);
			});

			const leaflet = await import('leaflet');
			let map = leaflet
				.map('map', { scrollWheelZoom: 'center', touchZoom: 'center' })
				.setView([lat, lon], 7);

			leaflet
				.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
					maxZoom: 19,
					attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				})
				.addTo(map);

			let marker = leaflet.marker([lat, lon], { draggable: true }).addTo(map);

			async function resetLatLon() {
				let latlng = marker.getLatLng();
				lat = Number(latlng.lat.toFixed(4));
				lon = Number(latlng.lng.toFixed(4));
				alt = await setElevation();
			}

			map.on('move', (e) => {
				marker.setLatLng(map.getCenter());
			});
			map.on('moveend', resetLatLon);

			alt = await setElevation();
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
			type="hidden"
			autocomplete="off"
			class={valid ? '' : 'invalid'}
			id="latlon"
			bind:value={latlon}
		/>
		<button type="submit">Go</button>
		{status}
	</form>
	<div>Latitude: {lat} Longitude: {lon} Elevation: {alt}m</div>
</header>

<div id="map" />

<style>
	header {
		font-family: 'Courier New', Courier, monospace;
		display: flex;
		gap: 2em;
		/* justify-content: center; */
		height: 2em;
	}
	button {
	}
	#map {
		width: 100vw;
		height: calc(100vh - 3em);
		padding: 0;
	}
	input.invalid {
		background-color: lightpink;
	}
</style>
