<script>
	import StyledContainer from '$lib/components/StyledContainer.svelte';
	import { eventsStore } from '$lib/stores/google';
</script>

<StyledContainer height={'80%'}>
	<div class="text-white w-full h-full border">{JSON.stringify($eventsStore)}</div>
</StyledContainer>
