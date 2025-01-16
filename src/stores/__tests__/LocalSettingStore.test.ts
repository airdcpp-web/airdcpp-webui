import {
  default as LocalSettingStore,
  SettingDefinitions,
} from 'stores/reflux/LocalSettingStore';
import { LocalSettings } from 'constants/SettingConstants';

describe('local setting store', () => {
  const findDefinition = (key: LocalSettings) =>
    SettingDefinitions.find((def) => def.key === key)!;

  test('should update values', () => {
    const key = LocalSettings.NOTIFY_PM_USER;
    LocalSettingStore.setValues({
      [key]: !findDefinition(key).default_value,
    });

    const storeValues = LocalSettingStore.getValues();

    SettingDefinitions.forEach((def) => {
      let expectedValue;
      if (def.key === key) {
        expectedValue = !def.default_value;
      } else {
        expectedValue = def.default_value;
      }

      expect(storeValues[def.key]).toEqual(expectedValue);
    });
  });
});
