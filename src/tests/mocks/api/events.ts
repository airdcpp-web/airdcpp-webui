import * as API from '@/types/api';

export const EventCountsResponse = {
  total: 2,
  unread: {
    error: 1,
    info: 1,
    verbose: 0,
    warning: 0,
  },
};

export const EventMessageInfo = {
  highlights: [],
  id: 1,
  is_read: true,
  label: 'Extensions',
  severity: API.SeverityEnum.INFO,
  text: '8 extensions were loaded (debug mode)',
  time: 1739606514,
  type: 'system',
};

export const EventMessageError = {
  highlights: [],
  id: 6,
  is_read: true,
  label: 'airdcpp-share-monitor',
  severity: API.SeverityEnum.ERROR,
  text: "Failed to add path E:\\🌍\\ for monitoring: ENOENT: no such file or directory, watch 'E:\\🌍\\'",
  time: 1739606515,
  type: 'system',
};

export const EventMessagesResponse = [EventMessageInfo, EventMessageError];
