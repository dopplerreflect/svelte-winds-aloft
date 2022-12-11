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
	}
	:root::-webkit-scrollbar {
		display: none;
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
</style>
