<script>
	import StyledContainer from '$lib/components/StyledContainer.svelte';
	import { tasksStore } from '$lib/stores/google';

	$: myTasks = $tasksStore.sort((a, b) => {
		if (!a.due) return 1;
		if (!b.due) return -1;
		return new Date(a.due) - new Date(b.due);
	});
</script>

<StyledContainer height={'80%'}>
	<div class="text-white w-full h-full border">
		{#if myTasks.length === 0}
			<p class="text-white">No tasks found.</p>
		{:else}
			<ul>
				{#each myTasks as task}
					<li>{task.title}</li>
					<li>{task.due}</li>
				{/each}
			</ul>
		{/if}
	</div>
</StyledContainer>
