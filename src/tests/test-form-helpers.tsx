import { fireEvent, getByText, RenderResult, waitFor } from '@testing-library/react';
import userEventOriginal, { UserEvent } from '@testing-library/user-event';
import selectEvent from 'react-select-event';

type FieldValueMap = {
  [key: string]: string;
};

export const setupUserEvent = () => {
  const userEvent = userEventOriginal.setup({
    // advanceTimers: jest.advanceTimersByTime,
    delay: null,
  });
  return userEvent;
};

export const expectFieldsDisabled = (
  labels: string[],
  getByLabelText: RenderResult['getByLabelText'],
) => {
  for (const label of labels) {
    const element = getByLabelText(label) as HTMLInputElement;
    /*if (label.indexOf('file') !== -1) {
      // File field, no browse button
      expect(element.querySelector('input')).not.toBeTruthy();
    } else*/ {
      expect(element.hasAttribute('disabled')).toBe(true);
    }
  }
};

export const expectFieldsEnabled = (
  labels: string[],
  getByLabelText: RenderResult['getByLabelText'],
) => {
  for (const label of labels) {
    const input = getByLabelText(label) as HTMLInputElement;
    expect(input.hasAttribute('disabled')).toBe(false);
  }
};

export const inputValuesEqual = (
  getByLabelText: RenderResult['getByLabelText'],
  fieldValueMap: FieldValueMap,
) => {
  for (const field of Object.keys(fieldValueMap)) {
    const input = getByLabelText(field) as HTMLInputElement;
    const value = fieldValueMap[field];
    expect(input.value).toEqual(value);
  }
};

export const selectValuesEqual = (
  getByLabelText: RenderResult['getByLabelText'],
  fieldValueMap: FieldValueMap,
) => {
  for (const field of Object.keys(fieldValueMap)) {
    const input = getByLabelText(field);
    const value = fieldValueMap[field];
    const inputValue = getByText(input, value);
    expect(inputValue).toBeDefined();
  }
};

export const setInputFieldValues = async (
  {
    getByLabelText,
    userEvent,
  }: Pick<RenderResult, 'getByLabelText'> & { userEvent: UserEvent },
  fieldValueMap: FieldValueMap,
) => {
  for (const field of Object.keys(fieldValueMap)) {
    const input = getByLabelText(field) as HTMLInputElement;
    if (!input) {
      throw new Error(`Input for field ${field} doesn't exist`);
    }

    const value = fieldValueMap[field];

    // Focus and type
    if (input.value) {
      await userEvent.clear(input);
    }

    await userEvent.type(input, value);

    await waitFor(() => {
      expect(input.value).toBe(value);
    });

    // Blur
    fireEvent.focusOut(input);
  }
};

export const setSelectFieldValues = async (
  { getByLabelText }: RenderResult,
  fieldValueMap: FieldValueMap,
) => {
  for (const field of Object.keys(fieldValueMap)) {
    const input = getByLabelText(field);
    if (!input) {
      throw new Error(`Input for field ${field} doesn't exist`);
    }

    const value = fieldValueMap[field];
    selectEvent.openMenu(input);
    await selectEvent.select(input, value);
  }
};

export const clearFirstSelectFieldValue = async (
  { getByLabelText }: RenderResult,
  field: string,
) => {
  const input = getByLabelText(field);
  if (!input) {
    throw new Error(`Input for field ${field} doesn't exist`);
  }

  await selectEvent.clearFirst(input);
};

/*export const expectElementsExist = (testIds, getByTestId) => {
  for (const testId of testIds) {
    expect(() => getByTestId(testId)).not.toThrow();
  }
}

export const expectElementsToMatchSnapshot = (testIds, getByTestId) => {
  for (const testId of testIds) {
    expect(getByTestId(testId)).toMatchSnapshot()
  }
}

export const expectElementsMissing = (testIds, getByTestId) => {
  for (const testId of testIds) {
    expect(() => getByTestId(testId)).toThrow();
  }
}*/
