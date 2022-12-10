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

	onMount(async () => {
		if (browser) {
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

			await navigator.geolocation.getCurrentPosition((p) => {
				lat = p.coords.latitude;
				lon = p.coords.longitude;
				map.setView([lat, lon]);
				marker.setLatLng({ lat, lng: lon });
			});

			async function resetLatLon() {
				let latlng = marker.getLatLng();
				lat = Number(latlng.lat.toFixed(4));
				lon = Number(latlng.lng.toFixed(4));
			}

			map.on('move', (e) => {
				marker.setLatLng(map.getCenter());
			});

			map.on('moveend', resetLatLon);

			marker.on('click', () => {
				submitButton.click();
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
	<div />
	<div class="centered">{status ? status : latlon}</div>
	<div>
		<!-- <a href={`/${latlon}`}><img class="icon" src="/arrow-icon.svg" alt="go" /></a> -->
		<button on:click={handleSubmit}>
			<img class="icon" src="/arrow-icon.svg" alt="go" />
		</button>
	</div>
</header>

<div id="map" />

<style>
	:root {
		--header-height: 3em;
	}
	.centered {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	header {
		display: grid;
		grid-template-columns: var(--header-height) 1fr var(--header-height);
		position: sticky;
		top: 0;
		height: var(--header-height);
		z-index: 2;
		color: white;
		background-color: hsla(210, 100%, 15%, 0.85);
	}
	header button {
		background-color: transparent;
		border: 0;
	}
	.icon {
		height: var(--header-height);
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
</style>
