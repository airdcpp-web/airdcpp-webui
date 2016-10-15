import update from 'react-addons-update';

const checkSplice = (messages, cacheMessageCount) => {
	if (messages) {
		const toRemove = messages.length - cacheMessageCount;
		if (toRemove > 0) {
			messages = update(messages, { $splice: [ [ 0, toRemove ] ] });
		}
	}

	return messages;
};

const MessageUtils = {
	// 
	checkUnread(data, actions, entityId) {
		if (data.unread_messages &&
			!Object.keys(data.unread_messages).every(key => data.unread_messages[key] === 0)) {

			// Reset unread counts
			actions.setRead(entityId);

			// Don't flash unread counts in the UI
			const unreadInfo = Object.keys(data.unread_messages).reduce(
				(reduced, key) => {
					reduced[key] = 0;
					return reduced;
				}, {}
			);

			data = {
				...data,
				unread_messages: unreadInfo,
			};
		}

		return data;
	},

	handleMessage(message, messages, cacheMessageCount) {
		if (!messages) {
			// Don't store messages before the initial fetch has completed
			return messages;
		}

		messages = update(messages, { $push: [ message ] });
		checkSplice(messages, cacheMessageCount);

		return messages;
	},

	getListMessageId(message) {
		return message.chat_message ? message.chat_message.id : message.log_message.id;
	},

	getListMessageTime(message) {
		return message.chat_message ? message.chat_message.time : message.log_message.time;
	},
};

export default Object.assign(MessageUtils, { 
	checkSplice,
});
