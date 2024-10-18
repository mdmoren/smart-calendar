<script>
	export let height = '10%';
	export let addTailwind = '';
	export let flexDirection = 'row';
</script>

<div
	class="p-4 bg-black bg-opacity-50 flex justify-center items-center rounded-lg shadow-md {addTailwind}"
	style="height: {height}; flex-direction: {flexDirection}"
>
	<slot />
</div>
