<script>
	import StyledContainer from '$lib/components/StyledContainer.svelte';
	import { currentTrack, isPlaying, progress, duration, device } from '$lib/stores/spotify';
	import Spotify from '$lib/icons/Spotify.svelte';
	import MusicNote from '$lib/icons/MusicNote.svelte';
	import Paused from '$lib/icons/Paused.svelte';
</script>

<StyledContainer height={'50%'} flexDirection={'column'} addTailwind={''}>
	<div
		class="flex h-[70%] bg-black bg-opacity-50 rounded-xl shadow-lg shadow-[#00000080] space-x-8"
	>
		<div class="overflow-hidden rounded-xl shadow-xl shadow-[#00000080]">
			<img src={$currentTrack.albumArt} alt="Album Art" class="w-full h-full" />
		</div>

		<div class="flex-1 flex flex-col justify-start items-start text-white">
			<div class="flex items-center justify-between w-full opacity-50">
				<p>Listening on Spotify</p>
				<Spotify />
			</div>
			<h3 class="text-lg font-bold text-wrap">{$currentTrack.name}</h3>
			<p class="font-semi-bold">{$currentTrack.artist}</p>
			{#if $isPlaying}
				<div class="flex justify-start items-center space-x-2">
					<p>Now Playing{$device !== null ? ' on ' + $device.name : ''}</p>
					<MusicNote />
				</div>
			{:else}
				<div class="flex justify-start items-center space-x-2">
					<p>Paused</p>
					<Paused />
				</div>
			{/if}
		</div>
	</div>

	<div class="w-full bg-black bg-opacity-50 rounded-full h-4 p-1">
		<div class="bg-white h-2 rounded-full" style={`width: ${($progress / $duration) * 100}%`}></div>
	</div>
</StyledContainer>
