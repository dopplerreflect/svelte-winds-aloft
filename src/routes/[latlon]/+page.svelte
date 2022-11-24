<script type="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="grid-container">
	{#each data.forecasts as forecast}
		<div>{forecast.header}</div>
		<div class="grid-container inner">
			{#each forecast.soundings as sounding}
				<div>{sounding.height}</div>
				<div>{sounding.direction}</div>
				<div>{sounding.speed}</div>
			{/each}
		</div>
	{/each}
</div>
<div>
	<code>{JSON.stringify(data.forecasts, null, 2)}</code>
</div>

<style>
	.grid-container {
		display: grid;
	}
	.grid-container.outer {
		grid-template-rows: 1em 1fr;
	}
	.grid-container.inner {
		grid-template-columns: 1fr 1fr 1fr;
	}
	code {
		white-space: pre;
	}
</style>
