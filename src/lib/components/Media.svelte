<script>
	import StyledContainer from '$lib/components/StyledContainer.svelte';
	import { backgroundColor, imageSrc, videoSrc, mediaType } from '$lib/stores/media';
</script>

<StyledContainer height={'50%'}>
	<div>
		<ul>
			<li>bg color - {$backgroundColor}</li>
			<li>image - {$imageSrc}</li>
			<li>video - {$videoSrc}</li>
			<li>media type - {$mediaType}</li>
		</ul>
		<img
			class="object-cover h-full w-full z-30 rounded-lg shadow-lg"
			src={$imageSrc}
			alt="Background"
		/>
	</div>
</StyledContainer>
