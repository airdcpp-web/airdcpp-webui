import { SimpleSessionUnreadUrgency } from 'constants/UrgencyConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';


// Get an array of urgencies that are larger than 0
const getValidUrgencyArray = (urgencies: UI.UrgencyCountMap): string[] => {
  return Object.keys(urgencies).filter(urgency => urgencies[urgency] > 0);
};

// Always convert empty objects to null
const validateUrgencies = (urgencies: UI.UrgencyCountMap): UI.UrgencyCountMap | null => {
  return getValidUrgencyArray(urgencies).length > 0 ? urgencies : null;
};

// Returns the maximum urgency from the map of urgencies (or undefined if all counts are 0)
const maxUrgency = (urgencies: UI.UrgencyCountMap): number | undefined => {
  const validUrgencies = getValidUrgencyArray(urgencies);
  if (validUrgencies.length === 0) {
    return undefined;
  }

  return Math.max.apply(null, validUrgencies);
};

const appendToMap = (counts: UI.UrgencyCountMap, urgency: UI.UrgencyEnum) => {
  counts[urgency] = counts[urgency] || 0;
  counts[urgency] += 1;
};

// Convert regular type -> count mapping to urgency -> count map
const toUrgencyMap = (
  source: API.UnreadChatMessageCounts | API.UnreadStatusMessageCounts, 
  urgencies: UI.UrgencyCountMap
) => {
  return validateUrgencies(
    Object.keys(source).reduce(
      (map, key) => {
        map[urgencies[key]] = source[key];
        return map;
      }, 
      {}
    )
  );
};

type SessionList = Array<UI.SessionItem>;
type UrgencyGetter = (session: UI.SessionItem) => UI.UrgencyCountMap | null;

// Returns urgency mapping for a message session with a "message_counts" property
const messageSessionMapper = (
  item: UI.MessageCounts, 
  urgencyMappings: UI.UrgencyCountMap
): UI.UrgencyCountMap | null => {
  return toUrgencyMap(item.message_counts.unread, urgencyMappings);
};

// Returns urgency mapping for a session with a simple "read" property
const simpleSessionMapper = (item: UI.ReadStatus): UI.UrgencyCountMap | null => {
  if (!item.read) {
    return {
      [SimpleSessionUnreadUrgency]: 1,
    };
  }

  return null;
};

// Get urgencyMap [urgency: numberOfSessions] for a list of sessions
const getSessionUrgencies = (sessions: SessionList, urgencyGetter: UrgencyGetter) => {
  const urgencies = sessions.reduce(
    (reduced, session) => {
      const urgencyMap = urgencyGetter(session);
      if (urgencyMap) {
        const max = maxUrgency(urgencyMap);
        if (max) {
          appendToMap(reduced, max);
        }
      }

      return reduced;
    }, 
    {}
  );

  return validateUrgencies(urgencies);
};

export {
  getSessionUrgencies,
  maxUrgency,
  toUrgencyMap,
  messageSessionMapper,
  simpleSessionMapper,
  appendToMap,
  validateUrgencies,
};
