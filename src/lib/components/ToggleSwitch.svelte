<script type="ts">
	type Label = {
		on: string;
		off: string;
	};
	export let label: Label = { on: 'On', off: 'Off' };
	export let checked: boolean = true;
	export let disabled: boolean = false;
</script>

<div class="switch-with-label">
	<div class="label">
		{checked ? label.on : label.off}
	</div>
	<label class="switch">
		<input {disabled} type="checkbox" bind:checked />
		<span class="slider round" />
	</label>
</div>

<style>
	.switch-with-label {
		display: inline-block;
		text-align: center;
		width: 5em;
		border: 1px solid black;
		border-radius: 0.5em;
		padding-bottom: 0.5em;
	}
	.label {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
		text-align: center;
	}
	/* The switch - the box around the slider */
	.switch {
		position: relative;
		display: inline-block;
		width: 2.5em;
		height: 1.5em;
	}

	/* Hide default HTML checkbox */
	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	/* The slider */
	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		-webkit-transition: 0.25s;
		transition: 0.25s;
	}

	.slider:before {
		position: absolute;
		content: '';
		height: 1.25em;
		width: 1.25em;
		left: 0.15em;
		bottom: 0.15em;
		background-color: white;
		-webkit-transition: 0.25s;
		transition: 0.25s;
	}

	input:checked + .slider {
		background-color: hsl(120, 100%, 25%);
	}

	input:focus + .slider {
		box-shadow: 0 0 3px hsl(120, 100%, 50%);
	}

	input:checked + .slider:before {
		-webkit-transform: translateX(1.25em);
		-ms-transform: translateX(1.25em);
		transform: translateX(1em);
	}

	/* Rounded sliders */
	.slider.round {
		border-radius: 0.75em;
	}

	.slider.round:before {
		border-radius: 50%;
	}
</style>
