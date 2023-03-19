import { QueuePriorityEnum } from 'types/api';

export const PriorityEnum = {
  [QueuePriorityEnum.PAUSED_FORCED]: { str: 'Paused (forced)', id: 0 },
  [QueuePriorityEnum.PAUSED]: { str: 'Paused', id: 1 },
  [QueuePriorityEnum.LOWEST]: { str: 'Lowest', id: 2 },
  [QueuePriorityEnum.LOW]: { str: 'Low', id: 3 },
  [QueuePriorityEnum.NORMAL]: { str: 'Normal', id: 4 },
  [QueuePriorityEnum.HIGH]: { str: 'High', id: 5 },
  [QueuePriorityEnum.HIGHEST]: { str: 'Highest', id: 6 },
};
