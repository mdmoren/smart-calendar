import { eventsStore, tasksStore } from '$lib/stores/google.js';

export const fetchEvents = async () => {
	const apiRoute = import.meta.env.VITE_API_ROUTE;
	const url = `${apiRoute}/google/events`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data = await response.json();

		const newEvents = [];
		data.forEach((calendar) => {
			calendar.events.forEach((event) => {
				newEvents.push({
					title: event.summary,
					start: event.start.date || event.start.dateTime,
					end: event.end.date || event.end.dateTime
				});
			});
		});

		// Update the store
		eventsStore.set(newEvents);
	} catch (error) {
		console.error("Error fetching events:", error);
		eventsStore.set([]); 
	}
};

export const fetchTasks = async () => {
	const apiRoute = import.meta.env.VITE_API_ROUTE;
	const url = `${apiRoute}/google/tasks`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data = await response.json();

		const newTasks = [];
		data.forEach((taskList) => {
			if (taskList.tasks) {
				taskList.tasks.forEach((task) => {
					newTasks.push({
						id: task.id,
						title: task.title,
						notes: task.notes,
						due: task.due,
						status: task.status,
						listName: taskList.listName
					});
				});
			}
		});

		// Update the store
		tasksStore.set(newTasks);
	} catch (error) {
		console.error("Error fetching tasks:", error);
		tasksStore.set([]); 
	}
};
``
