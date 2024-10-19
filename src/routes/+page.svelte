<script>
	import MonthCalendar from '$lib/components/MonthCalendar.svelte';
	import WeekCalendar from '$lib/components/WeekCalendar.svelte';
	import Tasks from '$lib/components/Tasks.svelte';
	import Weather from '$lib/components/Weather.svelte';
	import Spotify from '$lib/components/Spotify.svelte';
	import Media from '$lib/components/Media.svelte';
	import Clock from '$lib/components/Clock.svelte';

	import { isPlaying } from '$lib/stores/spotify';
</script>

<div
	class="fixed top-0 left-0 z-20 flex justify-center items-center w-full h-[100vh] p-8 space-x-4"
>
	<!-- Month Calendar and Weather -->
	<div class="flex flex-col w-[50%] h-full space-y-4">
		<MonthCalendar />
		<Weather />
	</div>

	<div class="flex w-[50%] h-full space-x-4">
		<div class="flex flex-col w-[50%] h-full space-y-4">
			<WeekCalendar />
			{#if $isPlaying}
				<Spotify />
			{:else}
				<Media />
			{/if}
		</div>

		<div class="flex flex-col w-[50%] h-full space-y-4">
			<Clock />
			<Tasks />
		</div>
	</div>

	<img
		class="absolute w-40 h-40 z-30 bottom-1 -right-1"
		src="src/lib/misc/plant.webp"
		alt="media"
	/>
	<div class="absolute w-16 h-2 bg-black z-20 bottom-10 right-12 blur-sm"></div>

	<img
		class="absolute w-40 h-40 z-20 bottom-11 right-20"
		src="src/lib/misc/lilplant.webp"
		alt="media"
	/>

	<div class="absolute w-8 h-2 bg-black z-10 bottom-10 right-36 blur-sm"></div>

	<img class="absolute w-24 h24 z-20 top-12 right-64" src="src/lib/misc/flower.webp" alt="media" />
</div>
