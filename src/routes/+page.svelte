<script type="ts">
	let latlon = '';
	$: coords = latlon
		.replace(/ /g, '')
		.split(',')
		.map((s) => Number(s).toFixed(4));
</script>

<form method="get" action="/{coords.join()}">
	<input type="text" id="latlon" bind:value={latlon} />
</form>

<p>{latlon}</p>

<code>{JSON.stringify(coords)}</code>
