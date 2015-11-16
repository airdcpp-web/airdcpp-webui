const PRIVATE_CHAT_MODULE_URL = 'private_chat/v0';
export default {
	MAX_PRIVATE_CHAT_MESSAGES: 100,

	PRIVATE_CHAT_MODULE_URL: PRIVATE_CHAT_MODULE_URL,
	PRIVATE_CHAT_SESSIONS_URL: PRIVATE_CHAT_MODULE_URL + '/sessions',
	PRIVATE_CHAT_SESSION_URL: PRIVATE_CHAT_MODULE_URL + '/session',

	CHAT_SESSION_CREATED: 'chat_session_created',
	CHAT_SESSION_REMOVED: 'chat_session_removed',
	CHAT_SESSION_UPDATED: 'chat_session_updated',

	PRIVATE_CHAT_MESSAGE: 'private_chat_message',
	PRIVATE_CHAT_STATUS: 'private_chat_status',
};
