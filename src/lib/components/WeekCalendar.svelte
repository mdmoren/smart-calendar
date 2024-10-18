<script>
	import StyledContainer from '$lib/components/StyledContainer.svelte';
	import { eventsStore } from '$lib/stores/google';
</script>

<StyledContainer height={'50%'}>
	<div class="text-white w-full h-full border overflow-clip">{JSON.stringify($eventsStore)}</div>
</StyledContainer>
