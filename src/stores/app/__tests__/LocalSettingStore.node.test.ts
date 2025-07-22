import { describe, expect, test } from 'vitest';
import {
  LocalSettingDefinitions,
  LocalSettings,
} from '../../../constants/LocalSettingConstants';
import { createAppStore } from '..';
import { getLocalSettingValueMap } from '@/utils/LocalSettingUtils';

describe('local setting store', () => {
  const findDefinition = (key: LocalSettings) =>
    LocalSettingDefinitions.find((def) => def.key === key)!;

  test('should update values', () => {
    const key = LocalSettings.NOTIFY_PM_USER;

    const appStore = createAppStore();
    appStore.getState().settings.setValues({
      [key]: !findDefinition(key).default_value,
    });

    const storeValues = getLocalSettingValueMap(appStore.getState().settings.settings);

    LocalSettingDefinitions.forEach((def) => {
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
