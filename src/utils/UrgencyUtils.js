//import { SeverityEnum } from 'constants/LogConstants';

// Returns the maximum urgency from the map of urgencies (or undefined if all counts are 0)
const maxUrgency = (urgencyMap) => {
	const validUrgencies = Object.keys(urgencyMap).filter(urgency => urgencyMap[urgency] > 0);
	if (validUrgencies.length === 0) {
		return undefined;
	}

	return Math.max.apply(null, validUrgencies);
};

const appendToMap = (counts, urgency) => {
	counts[urgency] = counts[urgency] || 0;
	counts[urgency] += 1;
};

// Convert regular type -> count mapping to urgency -> count map
const toUrgencyMap = (source, urgencies) => {
	return Object.keys(source).reduce((map, key) => {
		map[urgencies[key]] = source[key];
		return map;
	}, {});
};

const UrgencyUtils = {
	// Get urgencyMap [urgency: numberOfMessages] for a list of messages
	getMessageUrgencies(messages, urgencies, infoProperty) {
		const counts = {};

		messages.forEach(message => {
			if (!message.is_read) {
				appendToMap(counts, urgencies[message[infoProperty]]);
			}
		});

		return counts;
	},

	// Get urgencyMap [urgency: numberOfSessions] for a list of sessions
	getSessionUrgencies(sessions, urgencies, infoProperty) {
		const counts = {};

		sessions.forEach(session => {
			const urgencyMap = toUrgencyMap(session[infoProperty], urgencies);
			const max = maxUrgency(urgencyMap);
			if (max) {
				appendToMap(counts, max);
			}
		});

		return counts;
	},
};

export default Object.assign(UrgencyUtils, {
	maxUrgency,
	toUrgencyMap,
	appendToMap,
});