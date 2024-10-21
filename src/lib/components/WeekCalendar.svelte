<script>
	import StyledContainer from '$lib/components/StyledContainer.svelte';
	import { eventsStore } from '$lib/stores/google';
	import FullCalendar from 'svelte-fullcalendar';
	import listPlugin from '@fullcalendar/list';

	$: filteredEventsStore = $eventsStore.filter((event) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return new Date(event.start) >= today;
	});

	$: options = {
		initialView: 'listWeek',
		plugins: [listPlugin],
		headerToolbar: {
			left: '',
			center: '',
			right: ''
		},
		events: filteredEventsStore,
		slotDuration: '00:30:00'
	};
</script>

<StyledContainer height={'50%'}>
	<div class="flex flex-col w-full h-full">
		<div class="flex justify-center items-center w-full h-[7%]">
			<h2 class="text-2xl font-semibold text-center text-white">Coming up</h2>
		</div>
		{#if $eventsStore.length > 0}
			<FullCalendar {options} class="w-full  h-[93%]" />
		{:else}
			<div class="w-full h-full flex flex-col justify-center items-center relative">
				<img class="w-84 h-84" src="src/lib/misc/greenhouse.webp" alt="media" />
				<p class="text-white font-semibold text-xl absolute bottom-4 left=[50%]">
					No upcoming events!
				</p>
			</div>
		{/if}
	</div>
</StyledContainer>
