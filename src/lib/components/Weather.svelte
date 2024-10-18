<script>
	import StyledContainer from '$lib/components/StyledContainer.svelte';
	import { onMount, onDestroy } from 'svelte';

	let forecastData = null;
	let error = null;
	let intervalId;
	let currentTime = new Date();

	const fetchWeatherData = async () => {
		const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
		const location = import.meta.env.VITE_MY_LOCATION;
		const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`;

		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error('Failed to fetch weather data');
			}
			forecastData = await response.json();
		} catch (err) {
			error = err.message;
		}
	};

	onMount(() => {
		fetchWeatherData();
		intervalId = setInterval(fetchWeatherData, 15 * 30 * 1000);

		const timeUpdateInterval = setInterval(() => {
			currentTime = new Date();
		}, 60 * 1000);

		return () => {
			clearInterval(intervalId);
			clearInterval(timeUpdateInterval);
		};
	});

	onDestroy(() => {
		clearInterval(intervalId);
	});

	const getDayDescription = (inputDate) => {
		const date = new Date(inputDate + 'T00:00:00');
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1);
		const yesterday = new Date(today);
		yesterday.setDate(today.getDate() - 1);

		const formatDate = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

		if (formatDate(date).getTime() === formatDate(today).getTime()) {
			return 'Today';
		} else if (formatDate(date).getTime() === formatDate(tomorrow).getTime()) {
			return 'Tomorrow';
		} else if (formatDate(date).getTime() === formatDate(yesterday).getTime()) {
			return 'Yesterday';
		} else {
			const options = { weekday: 'long' };
			return date.toLocaleDateString('en-US', options);
		}
	};

	$: getNext6Hours = (hours) => {
		const currentHour = currentTime.getHours();
		return hours.filter((hourly) => {
			const hourTime = new Date(hourly.time).getHours();
			return hourTime > currentHour && hourTime < currentHour + 7;
		});
	};

	const formatTime = (time) => {
		const ftime = new Date(time).toLocaleTimeString([], { hour: '2-digit' });

		if (ftime[0] === '0') {
			return ftime.slice(1);
		} else {
			return ftime;
		}
	};
</script>

{#if error}
	<StyledContainer height="20%" addTailwind="text-white">
		<p>Error: {error}</p>
	</StyledContainer>
{:else if forecastData}
	<div class="flex justify-center items-stretch h-[20%] space-x-4">
		{#each forecastData.forecast.forecastday as day}
			<StyledContainer
				height="100%"
				addTailwind={`${getDayDescription(day.date) === 'Today' ? 'w-[50%]' : 'w-[25%]'} text-white space-x-4 relative`}
			>
				{#if getDayDescription(day.date) === 'Today'}
					<div class="flex h-full w-full space-x-4">
						<div class="flex-col flex-1 h-full">
							<div class="flex w-full h-[50%] justify-evenly items-center border-b">
								<p class="font-semibold text-2xl">{getDayDescription(day.date)}</p>
								<p class="font-semibold text-4xl">
									{forecastData.current.temp_f.toFixed(0) + ' °F'}
								</p>
								<div>
									<p class="">High: {day.day.maxtemp_f.toFixed(0)}°F</p>
									<p class="">Low: {day.day.mintemp_f.toFixed(0)}°F</p>
								</div>
							</div>

							<div class="flex w-full items-center justify-center h-[50%] pt-4">
								{#each getNext6Hours(day.hour) as hourly}
									<div
										class="flex flex-col justify-center items-center border-r last:border-none px-4"
									>
										<p class="text-lg">{hourly.temp_f.toFixed(0) + ' °F'}</p>
										<p class="text-sm font-semibold">
											{formatTime(hourly.time)}
										</p>
									</div>
								{/each}
							</div>
						</div>

						<div class="flex flex-col justify-center items-center border rounded-md">
							<img
								src={day.day.condition.icon}
								alt={day.day.condition.text}
								class="w-24 object-contain opacity-75"
							/>
							<p class="font-semibold text-sm text-wrap">{day.day.condition.text}</p>
						</div>
					</div>
				{:else}
					<div class="flex h-full w-full">
						<div class="flex flex-1 flex-col justify-center items-center">
							<div class="p-4 border-b h-[50%] flex justify-center items-end">
								<p class="font-semibold text-lg text-center">
									{getDayDescription(day.date)}
								</p>
							</div>
							<div class="flex flex-col items-center justify-center h-[50%]">
								<p class="">High: {day.day.maxtemp_f.toFixed(0)}°F</p>
								<p class="">Low: {day.day.mintemp_f.toFixed(0)}°F</p>
							</div>
						</div>
						<div class="flex flex-col justify-center items-center border rounded-md">
							<img
								src={day.day.condition.icon}
								alt={day.day.condition.text}
								class="w-24 object-contain opacity-75"
							/>
							<p class="font-semibold text-sm text-wrap">{day.day.condition.text}</p>
						</div>
					</div>
				{/if}
			</StyledContainer>
		{/each}
	</div>
{:else}
	<StyledContainer height="20%" addTailwind="text-white">
		<p>Loading...</p>
	</StyledContainer>
{/if}
