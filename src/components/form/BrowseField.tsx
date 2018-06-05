import React from 'react';
import classNames from 'classnames';

import History from 'utils/History';
import t from 'utils/tcomb-form';

import Button from 'components/semantic/Button';
import FileBrowserDialog from 'components/filebrowser/FileBrowserDialog';
import OverlayConstants from 'constants/OverlayConstants';

import AccessConstants from 'constants/AccessConstants';
import LoginStore from 'stores/LoginStore';


const BrowseField = t.form.Form.templates.textbox.clone({
  // override default implementation
  renderInput: (locals: any) => {
    let _input: HTMLInputElement;
    
    const onConfirm = (path: string) => {
      locals.onChange(path);
    };

    const showBrowseDialog = () => {
      const { location } = locals.context.router.route;
      History.pushModal(location, `${location.pathname}/browse`, OverlayConstants.FILE_BROWSER_MODAL, {
        historyId: (locals.config && !locals.value) ? locals.config.historyId : undefined,
      });
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      locals.onChange(event.target.value);
      setTimeout(_input.focus());
    };

    const hasAccess = LoginStore.hasAccess(AccessConstants.FILESYSTEM_VIEW);
    const fieldStyle = classNames(
      'ui fluid input field',
      { 'action': hasAccess },
    );

    return (
      <div className={ fieldStyle }>
        <input
          ref={ input => { 
            _input = input as HTMLInputElement;
          } }
          value={ locals.value }
          onChange={ onChange }
        />
        { hasAccess && (
          <Button
            caption="Browse"
            onClick={ showBrowseDialog }
          />
        ) }
        <FileBrowserDialog
          onConfirm={ onConfirm }
          subHeader={ locals.label }
          initialPath={ locals.value ? locals.value : '' }
          isFile={ locals.config.isFile }
        />
      </div>
    );
  }
});

export default BrowseField;