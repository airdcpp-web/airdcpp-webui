import PrivateChatActions from 'actions/PrivateChatActions';
import PrivateChatMessageStore from 'stores/PrivateChatMessageStore';


const sessionId = 0;
const chatMessage0 = {
	id: 0,
};

const statusMessage1 = {
	id: 1,
};

const messages = [
	{
		chat_message: chatMessage0,
	}, 
	{
		log_message: statusMessage1,
	}
];

const clearMessages = () => {
	PrivateChatMessageStore._onSessionUpdated({
		total_messages: 0,
	}, sessionId);
};


describe('message store', () => {
	jest.useFakeTimers();
	afterEach(() => {
		clearMessages();
	});

	test('should add individual messages', () => {
		PrivateChatMessageStore._onChatMessage(chatMessage0, sessionId);
		PrivateChatMessageStore._onStatusMessage(statusMessage1, sessionId);

		expect(PrivateChatMessageStore.getSessionMessages(sessionId)).toEqual(messages);
	});

	test('should clear messages', () => {
		PrivateChatMessageStore._onStatusMessage(statusMessage1, sessionId);

		clearMessages();

		expect(PrivateChatMessageStore.getSessionMessages(sessionId).length).toEqual(0);
	});

	test('should handle messages received during fetching', () => {
		const chatMessage2 = {
			id: 2,
		};

		PrivateChatMessageStore._onStatusMessage(statusMessage1, sessionId);
		PrivateChatMessageStore._onChatMessage(chatMessage2, sessionId);

		PrivateChatActions.fetchMessages.completed(sessionId, messages);
		jest.runAllTimers();

		// All three messages should have been stored
		expect(PrivateChatMessageStore.getSessionMessages(sessionId)).toEqual([
			...messages,
			{
				chat_message: chatMessage2,
			}
		]);
	});

	test('should remove duplicates arriving after fetching', () => {
		PrivateChatActions.fetchMessages.completed(sessionId, messages);
		jest.runAllTimers();

		PrivateChatMessageStore._onStatusMessage(statusMessage1, sessionId);

		expect(PrivateChatMessageStore.getSessionMessages(sessionId)).toEqual(messages);
	});
});