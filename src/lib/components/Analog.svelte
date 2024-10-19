<script>
	import { onMount, onDestroy } from 'svelte';

	let now = new Date();
	let interval;

	const updateClock = () => {
		now = new Date();
	};

	onMount(() => {
		interval = setInterval(updateClock, 1000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});

	$: hourRotation = (now.getHours() % 12) * 30 + now.getMinutes() * 0.5;
	$: minuteRotation = now.getMinutes() * 6;
	$: secondRotation = now.getSeconds() * 6;
</script>

<div class="w-full h-full rounded-full bg-white bg-opacity-50 relative">
	<!-- Clock face -->
	<div class="absolute inset-0 rounded-full"></div>

	<!-- Clock hands -->
	<div
		class="absolute w-1 h-14 bg-black rounded-full origin-bottom"
		style="bottom: 50%; left: 50%; transform: translateX(-50%) rotate({hourRotation}deg);"
	></div>
	<div
		class="absolute w-1 h-16 bg-black bg-opacity-50 rounded-full origin-bottom"
		style="bottom: 50%; left: 50%; transform: translateX(-50%) rotate({minuteRotation}deg);"
	></div>
	<div
		class="absolute w-0.5 h-16 bg-white rounded-full origin-bottom"
		style="bottom: 50%; left: 50%; transform: translateX(-50%) rotate({secondRotation}deg);"
	></div>

	<!-- Center dot -->
	<div
		class="absolute w-3 h-3 bg-gray-800 rounded-full"
		style="top: 50%; left: 50%; transform: translate(-50%, -50%);"
	></div>
</div>
