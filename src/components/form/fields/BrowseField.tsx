import { useRef, useState } from 'react';
import * as React from 'react';
import classNames from 'classnames';

import tcomb from 'utils/tcomb-form';

import Button from 'components/semantic/Button';
import { FileBrowserDialog } from 'components/filebrowser';

import LoginStore from 'stores/LoginStore';

import * as API from 'types/api';
import * as UI from 'types/ui';


interface BrowseFieldConfig {
  historyId: string;
  fileSelectMode: UI.FileSelectModeEnum;
}

interface BrowserFieldProps {
  locals: UI.FormLocals<any, string, BrowseFieldConfig>;
}

export const BrowseFieldInput = ({ locals }: BrowserFieldProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [ dialogOpen, setDialogOpen ] = useState(false);
    
  const onConfirm = (path: string) => {
    locals.onChange(path);
    setDialogOpen(false);
  };

  const parseHistoryId = () => {
    return (locals.config && !locals.value) ? locals.config.historyId : undefined;
  };

  const showBrowseDialog = () => {
    setDialogOpen(true);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    locals.onChange(event.target.value);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    });
  };

  const hasAccess = LoginStore.hasAccess(API.AccessEnum.FILESYSTEM_VIEW);
  const fieldStyle = classNames(
    'ui fluid input field',
    { 'action': hasAccess },
  );
  
  const { formT } = locals.context;
  return (
    <div className={ fieldStyle }>
      <input
        ref={ inputRef }
        value={ locals.value }
        onChange={ onChange }
      />
      { hasAccess && (
        <Button
          caption={ formT.translate('Browse') }
          onClick={ showBrowseDialog }
        />
      ) }
      { dialogOpen && (
        <FileBrowserDialog
          onConfirm={ onConfirm }
          subHeader={ locals.label }
          initialPath={ locals.value ? locals.value : '' }
          selectMode={ locals.config.fileSelectMode }
          historyId={ parseHistoryId() }
          onClose={ () => setDialogOpen(false) }
        />
      )}
    </div>
  );
};

export const BrowseField = tcomb.form.Form.templates.textbox.clone({
  // override default implementation
  renderInput: (locals: UI.FormLocals<any, string, BrowseFieldConfig>) => {
    return (
      <BrowseFieldInput
        locals={ locals }
      />
    );
  }
});
