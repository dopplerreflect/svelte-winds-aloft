<script type="ts">
	import { goto } from '$app/navigation';
	let latlon = '33.9769, -85.1703';
	$: valid = latlon.match(/^[\d]+\.[\d]+[, ]*[-]?[\d]+\.[\d]+[, \d]*/);
	$: coords = latlon
		.replace(/ /g, '')
		.split(',')
		.map((s) => Number(s).toFixed(4));

	const handleSubmit = () => {
		if (valid) {
			goto(`/${coords.join()}`);
		}
	};
</script>

<form on:submit|preventDefault={handleSubmit}>
	<input
		autocomplete="off"
		class={valid ? '' : 'invalid'}
		type="text"
		id="latlon"
		bind:value={latlon}
	/>
</form>

<code>{JSON.stringify(coords)}</code>

<style>
	input.invalid {
		background-color: lightpink;
	}
</style>
