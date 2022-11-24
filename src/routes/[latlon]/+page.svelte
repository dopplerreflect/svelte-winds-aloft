<script type="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="grid-container">
	{#each data.forecasts as forecast}
		<div>{forecast.header}</div>
	{/each}
</div>
<div>
	<code>{JSON.stringify(data.forecasts, null, 2)}</code>
</div>

<style>
	.grid-container {
		display: grid;
	}
	.grid-container div {
		border: 1px solid grey;
	}
	code {
		white-space: pre;
	}
</style>
