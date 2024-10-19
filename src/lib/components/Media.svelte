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
	</div>
</StyledContainer>
