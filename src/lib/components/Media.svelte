<script>
	import StyledContainer from '$lib/components/StyledContainer.svelte';
	import { backgroundColor, imageSrc, videoSrc, mediaType } from '$lib/stores/media';
</script>

<StyledContainer height={'50%'}>
	<img
		class="object-cover h-full w-full z-30 rounded-sm shadow-lg"
		src={$imageSrc}
		alt="Background"
	/>
</StyledContainer>
