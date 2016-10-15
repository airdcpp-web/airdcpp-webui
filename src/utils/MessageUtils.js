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

const filterListed = (messageList, message) => {
	const id = MessageUtils.getListMessageId(message);
	return !messageList.find(existingMessage => MessageUtils.getListMessageId(existingMessage) === id);
};

const getListMessageId = (message) => {
	return message.chat_message ? message.chat_message.id : message.log_message ? message.log_message.id : message.id;
};

const getListMessageTime = (message) => {
	return message.chat_message ? message.chat_message.time : message.log_message ? message.log_message.time : message.time;
};


const MessageUtils = {
	// Update the data with unread info that is marked as read
	// Marks the session as read also in the backend
	checkUnread(data, actions, entityId) {
		if (!data.unread_messages && data.read === false) {
			// Non-chat session
			actions.setRead(entityId);
			data = {
				...data,
				read: true,
			};
		} else if (data.unread_messages &&
			!Object.keys(data.unread_messages).every(key => data.unread_messages[key] === 0)) {
			// Chat session

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

	// Messages may have been received via listener while fetching cached ones
	// Append the received non-dupe messages to fetched list
	mergeCacheMessages(cacheMessages, existingMessages = []) {
		return [
			...cacheMessages,
			...existingMessages.filter(filterListed.bind(this, cacheMessages)),
		];
	},

	// Push the message to the existing list of messages (if it's not there yet)
	// Returns the updated message list
	pushMessage(message, messages = []) {
		if (messages.length > 0) {
			// Messages can arrive simultaneously when the cached messages are fetched, don't add duplicates
			const lastMessage = messages[messages.length-1];
			const currentMessageId = getListMessageId(message);
			if (getListMessageId(lastMessage) >= currentMessageId) {
				return messages;
			}
		}

		messages = update(messages, { $push: [ message ] });
		return messages;
	},
};

export default Object.assign(MessageUtils, { 
	getListMessageId,
	getListMessageTime,
	checkSplice,
});
