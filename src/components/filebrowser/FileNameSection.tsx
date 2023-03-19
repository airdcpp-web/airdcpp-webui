import * as React from 'react';

import * as UI from 'types/ui';
import { translate } from 'utils/TranslationUtils';

export interface FileNameSectionProps {
  currentFileName: string;
  onChange: (name: string) => void;
  t: UI.TranslateF;
}

export const FileNameSection: React.FC<FileNameSectionProps> = ({
  currentFileName,
  onChange,
  t,
}) => (
  <form className="ui form segment file-name">
    <div className="field">
      <label>{translate('Filename', t, UI.Modules.COMMON)}</label>
      <div className="ui input">
        <input value={currentFileName} onChange={(evt) => onChange(evt.target.value)} />
      </div>
    </div>
  </form>
);
