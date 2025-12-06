// src/lib/types/sessions.ts
interface Session {
	telegramId?: number;
	username?: string;
	authorized?: boolean;
	createdAt?: Date;
}

export const sessions: Record<string, Session> = {};
