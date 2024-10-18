<script>
	import StyledContainer from '$lib/components/StyledContainer.svelte';
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
	<p class="text-8xl font-semibold text-white pb-2">{time}</p>
</StyledContainer>
