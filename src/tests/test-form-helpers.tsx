import { fireEvent, getByText, RenderResult, waitFor } from '@testing-library/react';
import userEventOriginal, { UserEvent } from '@testing-library/user-event';
import selectEvent from './react-select-event';

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
    expect(element.hasAttribute('disabled')).toBe(true);
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

export const expectFieldValue = (
  { getByLabelText }: Pick<RenderResult, 'getByLabelText'>,
  field: string,
  value: string,
) => {
  const input = getByLabelText(field) as HTMLInputElement;
  if (!input) {
    throw new Error(`Input for field ${field} doesn't exist`);
  }

  expect(input.value).toBe(value);
};

// REACT-SELECT HELPERS
export const getSelectFieldValues = (
  { getByRole }: Pick<RenderResult, 'getByRole'>,
  field: string,
) => {
  const form = getByRole('form');
  const inputs = form.getElementsByTagName('input');
  const values = [];
  for (const input of inputs) {
    if (input.name === field) {
      values.push(input.value);
    }
  }
  return values;
};

const EmptySelectValue = [''];

export const clearSelectFieldValue = async (
  { getByLabelText, getByRole }: Pick<RenderResult, 'getByLabelText' | 'getByRole'>,
  { label, id }: LabeledItem,
) => {
  const input = getByLabelText(label) as HTMLInputElement;
  if (!input) {
    throw new Error(`Input for field ${label} doesn't exist`);
  }

  await selectEvent.clearAll(input);

  await waitFor(() => {
    const values = getSelectFieldValues({ getByRole }, id);
    expect(values).toStrictEqual(EmptySelectValue);
  });
};

interface LabeledItem {
  id: string;
  label: string;
}

interface SelectData {
  field: LabeledItem;
  options: Array<LabeledItem>;
}

export const addSelectFieldValues = async (
  { getByLabelText, getByRole }: Pick<RenderResult, 'getByLabelText' | 'getByRole'>,
  selectData: SelectData,
) => {
  const input = getByLabelText(selectData.field.label) as HTMLInputElement;
  if (!input) {
    throw new Error(`Input for field ${selectData.field.label} doesn't exist`);
  }

  for (const option of selectData.options) {
    await selectEvent.select(input, option.label);

    await waitFor(() => {
      const values = getSelectFieldValues({ getByRole }, selectData.field.id);
      expect(values).toContain(option.id);
    });
  }
};

export const setSelectFieldValues = async (
  { getByLabelText, getByRole }: Pick<RenderResult, 'getByLabelText' | 'getByRole'>,
  selectData: SelectData,
) => {
  await clearSelectFieldValue({ getByLabelText, getByRole }, selectData.field);
  await addSelectFieldValues({ getByLabelText, getByRole }, selectData);
};
