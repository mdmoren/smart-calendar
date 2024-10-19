<script>
	import StyledContainer from '$lib/components/StyledContainer.svelte';
	import FullCalendar from 'svelte-fullcalendar';
	import daygridPlugin from '@fullcalendar/daygrid';
	import { eventsStore } from '$lib/stores/google';

	$: options = {
		initialView: 'dayGridMonth',
		plugins: [daygridPlugin],
		headerToolbar: {
			left: '',
			center: 'title',
			right: ''
		},
		events: $eventsStore
	};
</script>

<StyledContainer height={'80%'}>
	<FullCalendar {options} class="w-full h-full" />
</StyledContainer>
