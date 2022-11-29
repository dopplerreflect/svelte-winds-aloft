<script type="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	let submitButton: HTMLButtonElement;
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
				.map('map', { scrollWheelZoom: 'center', touchZoom: 'center', zoomControl: false })
				.setView([lat, lon], 7);

			leaflet.control.zoom({ position: 'bottomright' }).addTo(map);

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

			marker.on('click', () => {
				console.log('clicked marker');
				submitButton.click();
			});

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

<form on:submit|preventDefault={handleSubmit}>
	<input
		type="hidden"
		autocomplete="off"
		class={valid ? '' : 'invalid'}
		id="latlon"
		bind:value={latlon}
	/>
	<button bind:this={submitButton} type="submit">➤</button>
</form>

<header>
	<div>Latitude:</div>
	<div>{lat}</div>
	<div>Longitude:</div>
	<div>{lon}</div>
	<div>Elevation:</div>
	<div>{alt}</div>
</header>

<div id="map" />

<style>
	header {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		font-family: 'Courier New', Courier, monospace;
		font-weight: bold;
		display: grid;
		grid-template-columns: 1fr 1fr;
		background-color: hsla(220, 50%, 50%, 0.33);
	}
	header > div:nth-child(even) {
		text-align: right;
	}
	form {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 2;
	}
	form button {
		font-size: 3em;
		line-height: 1em;
		background-color: hsla(120, 50%, 50%, 0.33);
		border-radius: 1.5em;
	}
	form button:hover {
		background-color: hsla(120, 50%, 50%, 0.75);
		cursor: pointer;
	}
	#map {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 0;
		width: 100vw;
		height: 100vh;
		padding: 0;
	}
	input.invalid {
		background-color: lightpink;
	}
</style>
