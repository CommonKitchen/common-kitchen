import type { Customer } from './types';

// src/lib/types/sessions.ts
interface Session {
	authorized?: boolean;
	customer?: Customer;
}

export const sessions: Record<string, Session> = {};
