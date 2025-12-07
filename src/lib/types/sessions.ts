// src/lib/types/sessions.ts
interface Session {
	authorized?: boolean;
}

export const sessions: Record<string, Session> = {};
