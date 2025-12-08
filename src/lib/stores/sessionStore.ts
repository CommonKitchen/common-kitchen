// src/stores/sessionStore.js
import { writable } from 'svelte/store';

// Храним session_id в store
export const sessionStore = writable<string | null>(null);
