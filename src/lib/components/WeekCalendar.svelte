<script>
	import StyledContainer from '$lib/components/StyledContainer.svelte';
	import { derived } from 'svelte/store';
	import { eventsStore } from '$lib/stores/google';
	import FullCalendar from 'svelte-fullcalendar';
	import listPlugin from '@fullcalendar/list';

	function getStartOfWeek() {
		const now = new Date();
		const dayOfWeek = now.getDay();
		const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
		return new Date(now.setDate(diff));
	}

	function getEndOfWeek() {
		const startOfWeek = getStartOfWeek();
		return new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 6);
	}

	$: filteredEventsStore = derived(eventsStore, ($eventsStore) => {
		const now = new Date();
		const startOfWeek = getStartOfWeek();
		const endOfWeek = getEndOfWeek();

		return $eventsStore.filter((event) => {
			const eventStart = new Date(event.start);
			return eventStart >= now && eventStart >= startOfWeek && eventStart <= endOfWeek;
		});
	});

	$: options = {
		initialView: 'listWeek',
		plugins: [listPlugin],
		headerToolbar: {
			left: '',
			center: '',
			right: ''
		},
		events: $filteredEventsStore,
		slotDuration: '00:30:00'
	};
</script>

<StyledContainer height={'50%'}>
	<div class="flex flex-col w-full h-full">
		<div class="flex justify-center items-center w-full h-[7%]">
			<h2 class="text-3xl font-semibold text-center text-white">This Week</h2>
		</div>
		{#if $filteredEventsStore.length > 0}
			<FullCalendar {options} class="w-full  h-[93%]" />
		{:else}
			<div class="w-full h-full flex flex-col justify-center items-center relative">
				<img class="w-84 h-84" src="src/lib/misc/greenhouse.webp" alt="media" />
				<p class="text-white font-semibold text-xl absolute bottom-4 left=[50%]">
					No upcoming events 😊
				</p>
			</div>
		{/if}
	</div>
</StyledContainer>
