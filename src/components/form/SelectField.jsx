// @flow

import PropTypes from 'prop-types';
import * as React from 'react';
import Select, { SelectBase } from 'react-select';
import invariant from 'invariant';

import type { OptionsType } from 'react-select/lib/types';

import t from 'utils/tcomb-form';


const MultiValueContainer = ({ css, children, ...innerProps }) => {
  return (
    <a { ...innerProps } className="ui label">
      { children }
    </a>
  );
}

const MultiValueLabel = ({ children }) => {
  return children;
}

const MultiValueRemove = ({ css, ...innerProps }) => {
  return (
    <i { ...innerProps } className="delete icon"/>
  );
}

type Locals = {
  onChange: (values: *[]) => void,
  options: Array<{
    value: *,
    text: string,
  }>,
  value: any[],
};


const SelectTemplate: { renderSelect: (locals: Locals) => React.Node } = {
  renderSelect: (locals) => { // <- locals contains the "recipe" to build the UI
    const onChange = (values: OptionsType) => {
      locals.onChange(values.map(value => value.value, []));
    };

    // translate the option model from tcomb to react-select
    const options: OptionsType = locals.options.map(({ value, text }) => ({ value, label: text }));
    const value: OptionsType = locals.value.map(value => {
      const option = options.find(anyOption => anyOption.value === value);
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

const ReactSelect = t.form.Form.templates.select.clone(SelectTemplate);

export default ReactSelect;
