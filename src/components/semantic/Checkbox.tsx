import * as React from 'react';

import classNames from 'classnames';

import 'fomantic-ui-css/components/checkbox';
import 'fomantic-ui-css/components/checkbox.min.css';

export interface CheckboxProps {
  // Handler for state changes (receives bool as argument)
  onChange: (checked: boolean) => void;

  // Display type (slider or toggle), leave undefined for default
  type?: string;

  // Checkbox caption
  caption?: React.ReactNode;

  disabled?: boolean;
  floating?: boolean;

  // Selection state
  checked: boolean;
  className?: string;
  style?: React.CSSProperties;
  settings?: SemanticUI.CheckboxSettings;
  beforeUnchecked?: () => void;

  id?: string;
  name?: string;
}

class Checkbox extends React.PureComponent<CheckboxProps> {
  c: HTMLDivElement;
  componentDidMount() {
    const settings: SemanticUI.CheckboxSettings = {
      fireOnInit: false,
      onChecked: () => this.props.onChange(true),
      onUnchecked: () => this.props.onChange(false),
      beforeUnchecked: () =>
        !!this.props.beforeUnchecked ? this.props.beforeUnchecked() : (true as any),
      ...this.props.settings,
    };

    $(this.c).checkbox(settings);
  }

  componentDidUpdate(prevProps: CheckboxProps) {
    if (prevProps.checked !== this.props.checked) {
      if (this.props.checked) {
        $(this.c).checkbox('set checked');
      } else {
        $(this.c).checkbox('set unchecked');
      }
    }
  }

  render() {
    const { className, checked, caption, type, disabled, floating, style, id, name } =
      this.props;

    const checkboxStyle = classNames(
      'ui checkbox',
      { disabled: disabled },
      { floating: floating },
      className,
      type,
    );

    return (
      <div
        ref={(c) => {
          this.c = c!;
        }}
        className={checkboxStyle}
        style={style}
      >
        <input id={id} name={name} type="checkbox" defaultChecked={checked} />
        {!!caption && <label htmlFor={id}>{caption}</label>}
      </div>
    );
  }
}

export default Checkbox;
