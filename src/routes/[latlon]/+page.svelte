<script type="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div>
	<code>{JSON.stringify(data.forecasts, null, 2)}</code>
</div>

<style>
	code {
		white-space: pre;
	}
</style>
