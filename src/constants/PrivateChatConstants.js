const MODULE_URL = 'private_chat/v0';
export default {
	MODULE_URL: MODULE_URL,
	SESSIONS_URL: MODULE_URL + '/sessions',
	SESSION_URL: MODULE_URL + '/session',

	SESSION_CREATED: 'chat_session_created',
	SESSION_REMOVED: 'chat_session_removed',
	SESSION_UPDATED: 'chat_session_updated',

	MESSAGE: 'private_chat_message',
	STATUS: 'private_chat_status',
};
