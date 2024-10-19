<script>
	import StyledContainer from '$lib/components/StyledContainer.svelte';
	import { imageSrc } from '$lib/stores/media';
</script>

<StyledContainer height={'50%'}>
	<img class="object-cover h-full w-full z-30 rounded-sm" src={$imageSrc} alt="media" />
</StyledContainer>
