import React from 'react';

import { TFunction } from 'i18next';
import { ByteUnits, formatUnit } from 'utils/ValueFormat';


interface SizeFieldProps {
  t: TFunction;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

type Props = SizeFieldProps;

const SizeField: React.FC<Props> = ({ inputProps, t }) => (
  <div style={{ display: 'flex' }}>
    <input
      className="ui input"
      type="number"
      { ...inputProps }
      defaultValue="MiB"
      min={ 0 }
    />
    <select className="ui select" style={{ maxWidth: '100px' }}>
      { ByteUnits.map(unit => (
        <option 
          key={ unit }
          defaultValue={ unit }
          //selected={ unit === 'MiB' }
        >
          { formatUnit(unit, t) }
        </option>
      )) }
    </select>
  </div>
);

export { SizeField };
