<script>
	import MonthCalendar from '$lib/components/MonthCalendar.svelte';
	import WeekCalendar from '$lib/components/WeekCalendar.svelte';
	import Tasks from '$lib/components/Tasks.svelte';
	import Weather from '$lib/components/Weather.svelte';
	import Spotify from '$lib/components/Spotify.svelte';
	import Media from '$lib/components/Media.svelte';
	import Clock from '$lib/components/Clock.svelte';

	import { currentTrack } from '$lib/stores/spotify';
</script>

<div class="flex justify-center items-center w-full h-[100vh] p-8 space-x-4">
	<!-- Month Calendar and Weather -->
	<div class="flex flex-col w-[50%] h-full space-y-4">
		<MonthCalendar />
		<Weather />
	</div>

	<div class="flex w-[50%] h-full space-x-4">
		<div class="flex flex-col w-[50%] h-full space-y-4">
			<WeekCalendar />
			{#if $currentTrack}
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
</div>
