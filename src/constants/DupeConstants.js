export const DupeEnum = {
  NONE: 0,
  SHARE_PARTIAL: 1,
  SHARE_FULL: 2,
  QUEUE_PARTIAL: 3,
  QUEUE_FULL: 4,
  QUEUE_FINISHED: 5,
  SHARE_QUEUE: 6,
}

export const DupeStyle = val => {
  switch(val) {
    case DupeEnum.SHARE_PARTIAL: return 'dupe share partial';
    case DupeEnum.SHARE_FULL: return 'dupe share full';
    case DupeEnum.QUEUE_PARTIAL: return 'dupe queue partial';
    case DupeEnum.QUEUE_FULL: return 'dupe queue full';
    case DupeEnum.QUEUE_FINISHED: return 'dupe queue finished';
    case DupeEnum.SHARE_QUEUE: return 'dupe share queue';
    default: return '';
  }
}
