import { UrgencyEnum } from 'constants/UrgencyConstants';

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

const messageSessionMapper = (item, urgencyMappings) => {
	return UrgencyUtils.toUrgencyMap(item.unread_messages, urgencyMappings);
};

const simpleSessionMapper = (item) => {
	if (!item.read) {
		return {
			[UrgencyEnum.HIGH]: 1,
		};
	}

	return {};
};

const UrgencyUtils = {
	// Get urgencyMap [urgency: numberOfSessions] for a list of sessions
	getSessionUrgencies(sessions, urgencyGetter) {
		const counts = {};

		sessions.forEach(session => {
			const urgencyMap = urgencyGetter(session);
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
	messageSessionMapper,
	simpleSessionMapper,
	appendToMap,
});