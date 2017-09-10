import { UrgencyEnum } from 'constants/UrgencyConstants';

// Get an array of urgencies that are larger than 0
const getValidUrgencyArray = (urgencies) => {
  return Object.keys(urgencies).filter(urgency => urgencies[urgency] > 0);
};

// Always convert empty objects to null
const validateUrgencies = (urgencies) => {
  return getValidUrgencyArray(urgencies).length > 0 ? urgencies : null;
};

// Returns the maximum urgency from the map of urgencies (or undefined if all counts are 0)
const maxUrgency = (urgencies) => {
  const validUrgencies = getValidUrgencyArray(urgencies);
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
  return validateUrgencies(Object.keys(source).reduce((map, key) => {
    map[urgencies[key]] = source[key];
    return map;
  }, {}));
};

// Returns urgency mapping for a message session with a "message_counts" property
const messageSessionMapper = (item, urgencyMappings) => {
  return UrgencyUtils.toUrgencyMap(item.message_counts.unread, urgencyMappings);
};

// Returns urgency mapping for a session with a simple "read" property
const simpleSessionMapper = (item) => {
  if (!item.read) {
    return {
      [UrgencyEnum.HIGH]: 1,
    };
  }

  return null;
};

const UrgencyUtils = {
  // Get urgencyMap [urgency: numberOfSessions] for a list of sessions
  getSessionUrgencies(sessions, urgencyGetter) {
    const urgencies = sessions.reduce((reduced, session) => {
      const urgencyMap = urgencyGetter(session);
      if (urgencyMap) {
        const max = maxUrgency(urgencyMap);
        if (max) {
          appendToMap(reduced, max);
        }
      }

      return reduced;
    }, {});

    return validateUrgencies(urgencies);
  },
};

export default Object.assign(UrgencyUtils, {
  maxUrgency,
  toUrgencyMap,
  messageSessionMapper,
  simpleSessionMapper,
  appendToMap,
  validateUrgencies,
});