<script>
	import '../app.css';
	import { onMount, onDestroy } from 'svelte';
	import { initializeMediaWebSocket, closeMediaWebSocket } from '$lib/webSockets/mediaClient';
	import { initializeSpotifyWebSocket, closeSpotifyWebSocket } from '$lib/webSockets/spotifyClient';
	import { fetchEvents, fetchTasks } from '$lib/hooks/google';

	import { backgroundColor, imageSrc, videoSrc, mediaType } from '$lib/stores/media';
	import { currentTrack, isPlaying } from '$lib/stores/spotify';

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

{#if $isPlaying}
	<img
		src={$currentTrack.albumArt}
		alt="Album Art"
		class="fixed top-0 left-0 w-full h-full object-cover z-10 blur-md scale-110"
		style="background-color: {$backgroundColor}"
	/>
{:else if $mediaType === 'color'}
	<div
		class="fixed top-0 left-0 w-full h-full object-cover z-10"
		style="background-color: {$backgroundColor}"
	></div>
{:else if $mediaType === 'video'}
	<video
		class="fixed top-0 left-0 w-full h-full object-cover z-10"
		autoplay
		loop
		muted
		playsinline
		src={$videoSrc}
		style="background-color: {$backgroundColor};"
	>
		<track kind="captions" />
	</video>
{:else if $mediaType === 'image'}
	<img
		class="fixed top-0 left-0 w-full h-full object-cover z-10"
		src={$imageSrc}
		alt="Background"
		style="background-color: {$backgroundColor};"
	/>
{/if}
