//import PropTypes from 'prop-types';
import React from 'react';

// TODO: remove when types are available
//@ts-ignore
import Select from 'react-select';

import invariant from 'invariant';

import t from 'utils/tcomb-form';


const MultiValueContainer: React.SFC<any> = ({ css, children, ...innerProps }) => {
  return (
    <a { ...innerProps } className="ui label">
      { children }
    </a>
  );
}

const MultiValueLabel: React.SFC<any> = ({ children }) => {
  return children;
}

const MultiValueRemove: React.SFC<any> = ({ css, ...innerProps }) => {
  return (
    <i { ...innerProps } className="delete icon"/>
  );
}

type Locals = {
  onChange: (values: any[]) => void,
  options: Array<{
    value: any,
    text: string,
  }>,
  value: any[],
};


type TCombTemplate = { 
  renderSelect: (locals: Locals) => React.ReactNode; 
};

type OptionType = {
  label: string;
  value: any;
};

type OptionsType = OptionType[];

const SelectTemplate: TCombTemplate = {
  renderSelect: (locals) => { // <- locals contains the "recipe" to build the UI
    const onChange = (values: OptionsType) => {
      locals.onChange(values.map(value => value.value, []));
    };

    // translate the option model from tcomb to react-select
    const options: OptionsType = locals.options.map(({ value, text }) => ({ value, label: text }));
    const value: OptionsType = locals.value.map(value => {
      const option = options.find(anyOption => anyOption.value === value) as OptionType;
      invariant(!!option, 'All current values were not found from the option list');
      return option;
    });

    return (
      <Select
        value={ value }
        options={ options }
        onChange={ onChange }
        isMulti={ true }
        components={{ 
          MultiValueContainer,
          MultiValueLabel,
          MultiValueRemove,
        }}
        menuPlacement="top"
      />
    );
  }
};

const ReactSelect = (t as any).form.Form.templates.select.clone(SelectTemplate);

export default ReactSelect;
