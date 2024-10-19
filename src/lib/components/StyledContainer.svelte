<script>
	export let height = '10%';
	export let addTailwind = '';
	export let flexDirection = 'row';
	export let justify = 'center';
</script>

<div class="relative {addTailwind}" style="height: {height};">
	<div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-lg rounded-lg"></div>
	<div
		class="relative z-10 h-full w-full p-4 flex items-center rounded-lg shadow-md"
		style="flex-direction: {flexDirection}; justify-content: {justify};"
	>
		<slot />
	</div>
</div>
