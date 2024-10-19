<script>
	import StyledContainer from '$lib/components/StyledContainer.svelte';
	import Analog from '$lib/components/Analog.svelte';
	import { onMount } from 'svelte';

	let time;
	const timeOptions = {
		hour: '2-digit',
		minute: '2-digit',
		hour12: true
	};

	const updateTime = () => {
		let newTime = new Date().toLocaleTimeString([], timeOptions);
		time = newTime[0] === '0' ? newTime.slice(1) : newTime;
	};

	onMount(() => {
		updateTime();
		const interval = setInterval(updateTime, 1000);

		return () => clearInterval(interval);
	});
</script>

<StyledContainer height={'20%'}>
	<div class="flex justify-center items-center w-full h-full">
		<p class="text-7xl font-semibold text-white mr-8 border-b pb-8 px-8">{time}</p>
		<div class="h-36 w-36">
			<Analog />
		</div>
	</div>
</StyledContainer>
