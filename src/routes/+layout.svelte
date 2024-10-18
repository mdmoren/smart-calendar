<script>
	import '../app.css';
	import { onMount, onDestroy } from 'svelte';
	import { initializeMediaWebSocket, closeMediaWebSocket } from '$lib/webSockets/mediaClient';
	import { initializeSpotifyWebSocket, closeSpotifyWebSocket } from '$lib/webSockets/spotifyClient';
	import { fetchEvents, fetchTasks } from '$lib/hooks/google';

	onMount(() => {
		initializeMediaWebSocket();
		initializeSpotifyWebSocket();

		fetchEvents();
		fetchTasks();

		const eventInterval = setInterval(fetchEvents, 15 * 30 * 1000);
		const taskInterval = setInterval(fetchTasks, 15 * 30 * 1000);

		console.log('REFRESHED');

		return () => {
			clearInterval(eventInterval);
			clearInterval(taskInterval);
		};
	});

	onDestroy(() => {
		closeMediaWebSocket();
		closeSpotifyWebSocket();
	});
</script>

<slot />
