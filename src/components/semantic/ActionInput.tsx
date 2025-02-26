import * as React from 'react';

import Button, { ButtonProps } from '@/components/semantic/Button';
import Input from './Input';

export type SubmitCallback = (value: string) => void | Promise<void>;

export interface ActionInputProps extends Omit<ButtonProps, 'type'> {
  // Function to call with the value
  handleAction: SubmitCallback;

  // Input placeholder
  placeholder: string;
  type?: string;
}

const ActionInput: React.FC<ActionInputProps> = ({
  id,
  placeholder,
  handleAction,
  type = 'text',
  ...buttonProps
}) => {
  const [value, setValue] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const handleClick = async () => {
    setSaving(true);
    await handleAction(value);
    setSaving(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <Input
      type={type}
      id={id}
      placeholder={placeholder}
      onChange={handleChange}
      value={value}
    >
      <Button
        {...buttonProps}
        onClick={handleClick}
        loading={saving}
        disabled={value.length === 0}
      />
    </Input>
  );
};

export default ActionInput;
