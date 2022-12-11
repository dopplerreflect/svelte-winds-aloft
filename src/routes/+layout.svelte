<div class="app">
	<main>
		<slot />
	</main>
</div>

<style global>
	body {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
		margin: 0;
	}
	:root {
		--header-height: 3em;
		--svg-stroke-color: hsl(210, 100%, 75%);
		--svg-hover-stroke-color: hsl(210, 100%, 100%);
	}
	:root::-webkit-scrollbar {
		display: none;
	}
	svg.icon {
		width: var(--header-height);
		height: var(--header-height);
		stroke: var(--svg-stroke-color);
	}
	svg:hover {
		stroke: var(--svg-hover-stroke-color);
		cursor: pointer;
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
</style>
