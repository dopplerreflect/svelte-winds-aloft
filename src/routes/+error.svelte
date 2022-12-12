<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import ArrowIcon from '$lib/components/ArrowIcon.svelte';
</script>

<header>
	<div>
		<button
			on:click={() => {
				goto('/');
			}}
		>
			<ArrowIcon style="transform: rotate(180deg)" />
		</button>
	</div>
	<div class="centered">Dangit!</div>
	<div />
</header>

<main>{$page.error?.message}</main>

<style>
	main {
		display: flex;
		height: calc(100vh - var(--header-height));
		justify-content: center;
		align-items: center;
		font-size: large;
		font-weight: bold;
		color: red;
	}
</style>
