<script>
	import '../app.css';
	import { onMount, onDestroy } from 'svelte';
	import { initializeMediaWebSocket, closeMediaWebSocket } from '$lib/webSockets/mediaClient';
	import { initializeSpotifyWebSocket, closeSpotifyWebSocket } from '$lib/webSockets/spotifyClient';
	import { fetchEvents, fetchTasks } from '$lib/hooks/google';
	import { backgroundColor, imageSrc, videoSrc, mediaType } from '$lib/stores/media';

	onMount(() => {
		backgroundColor.set(localStorage.getItem('backgroundColor'));
		imageSrc.set(localStorage.getItem('imageSrc'));
		videoSrc.set(localStorage.getItem('videoSrc'));
		mediaType.set(localStorage.getItem('mediaType'));

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
