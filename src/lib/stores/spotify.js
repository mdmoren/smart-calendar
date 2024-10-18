import { writable } from 'svelte/store';

export const currentTrack = writable(null);
export const isPlaying = writable(false);
export const progress = writable(0);
export const duration = writable(0);
export const device = writable(null);