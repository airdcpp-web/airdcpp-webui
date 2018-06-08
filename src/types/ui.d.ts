
declare namespace UI {
  enum Urgency {
    HIGH = 5,
    MEDIUM = 3,
    LOW = 2,
    INFO = 1,
    STATUS = 0,
  }

  interface UrgencyCountMap {
    [key: number]: number;
  }

  export type FormValueBase = API.SettingValueBase | null;
  export type FormValue = API.SettingValue<FormValueBase>;
  export type FormValueMap = API.SettingValueMap<FormValueBase>;
}
