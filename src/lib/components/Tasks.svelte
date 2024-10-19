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
	<div class="flex flex-col w-full h-full">
		<h2 class="text-3xl font-semibold text-center text-white mb-4">Tasks</h2>
		{#if myTasks.length === 0}
			<p class="text-white">No tasks found.</p>
		{:else}
			<ul>
				{#each myTasks as task}
					<li
						class="mb-2 bg-black bg-opacity-50 px-4 py-2 rounded-md space-x-3 flex justify-between items-center"
					>
						<div class="flex justify-start items-center space-x-2 text-white">
							<div class="h-2 w-2 rounded-full bg-green-400 bg-opacity-50"></div>
							<span>
								{task.title}
							</span>
						</div>
						{#if task.due}
							<span class="text-sm text-white">
								Due: {new Date(task.due).toLocaleDateString('en-US', {
									month: '2-digit',
									day: '2-digit',
									year: 'numeric'
								})}
							</span>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</StyledContainer>
