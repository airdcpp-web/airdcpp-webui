import { useState, useEffect } from 'react';
import * as React from 'react';
import t from 'utils/tcomb-form';

import * as UI from 'types/ui';

import { ByteUnits, formatUnit, parseUnit } from 'utils/ValueFormat';


interface SizeFieldProps {
  moduleT: UI.ModuleTranslator;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  onChange: (size: number | null) => void;
  value: number;
}

type Props = SizeFieldProps;


const DEFAULT_UNIT_INDEX = 2;

const SizeField: React.FC<Props> = ({ inputProps, moduleT, onChange, value }) => {
  const [ displayValue, setDisplayValue ] = useState<number | undefined>(undefined);
  const [ unitIndex, setUnitIndex ] = useState<number>(DEFAULT_UNIT_INDEX);

  const valueToBytes = () => {
    let ret = displayValue || 0;
    if (!!unitIndex) {
      for (let i = 1; i <= unitIndex; i++) {
        ret *= 1024;
      }
    }
    
    return ret;
  };

  useEffect(
    () => {
      const newValue = valueToBytes();
      if (newValue !== value) {
        onChange(newValue);
      }
    },
    [ unitIndex, displayValue ]
  );

  useEffect(
    () => {
      const curBytes = valueToBytes();
      if (value !== curBytes) {
        const { value: parsedValue, unitIndex: parsedUnitIndex } = parseUnit(value, ByteUnits, 1024);
        setDisplayValue(parsedValue);
        setUnitIndex(!!value ? parsedUnitIndex : DEFAULT_UNIT_INDEX);
      }
    },
    [ value ]
  );
  
  return (
    <div style={{ display: 'flex' }}>
      <input
        className="ui input"
        type="number"
        { ...inputProps }
        min={ 0 }
        value={ displayValue || '' }
        onChange={ evt => {
          let newValue = !!evt.target.value ? parseInt(evt.target.value) : null;
          if (!!newValue) {
            setDisplayValue(newValue);
          } else {
            setDisplayValue(undefined);
          }
        } }
      />
      <select 
        className="ui select" 
        style={{ maxWidth: '100px' }}
        value={ ByteUnits[unitIndex] }
        onChange={ evt => {
          setUnitIndex(evt.target.selectedIndex);
        } }
      >
        { ByteUnits.map((unit, index) => (
          <option 
            key={ unit }
            defaultValue={ unit }
          >
            { formatUnit(unit, moduleT.plainT) }
          </option>
        )) }
      </select>
    </div>
  );
};


type TCombTemplate = { 
  renderInput: (locals: UI.FormLocals<any, number>) => React.ReactNode; 
};

const FileTypeField: TCombTemplate = {
  renderInput(locals) {
    return (
      <SizeField 
        onChange={ locals.onChange }
        value={ !!locals.value ? parseInt(locals.value as any) : 0 }
        moduleT={ locals.context.formT }
      />
    );
  }
};

export default t.form.Form.templates.textbox.clone(FileTypeField);

// export { SizeField };
