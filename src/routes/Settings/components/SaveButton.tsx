import PropTypes from 'prop-types';
import { Component } from 'react';
import Button from 'components/semantic/Button';

import LoginStore from 'stores/LoginStore';
import classNames from 'classnames';

import * as API from 'types/api';
import * as UI from 'types/ui';

export interface SaveButtonProps {
  saveHandler: () => Promise<void>;
  hasChanges: boolean;
  local?: boolean;
  className?: string;
  settingsT: UI.ModuleTranslator;
}

class SaveButton extends Component<SaveButtonProps> {
  static propTypes = {
    /**
     * Message title
     */
    hasChanges: PropTypes.bool.isRequired,

    /**
     * Error details
     */
    saveHandler: PropTypes.func.isRequired,

    local: PropTypes.bool,
  };

  state = {
    saving: false,
  };

  toggleSaveState = () => {
    this.setState({ saving: !this.state.saving });
  };

  onClick = () => {
    this.toggleSaveState();
    this.props.saveHandler().then(this.toggleSaveState).catch(this.toggleSaveState);
  };

  render() {
    const { local, hasChanges, className, settingsT } = this.props;

    const hasAccess: boolean =
      local || LoginStore.hasAccess(API.AccessEnum.SETTINGS_EDIT);

    let title;
    if (!hasAccess) {
      title = settingsT.translate('No save permission');
    } else {
      title = settingsT.translate(hasChanges ? 'Save changes' : 'No unsaved changes');
    }

    return (
      <Button
        className={classNames('save', className)}
        caption={title}
        icon={hasAccess && hasChanges ? 'green checkmark' : null}
        loading={this.state.saving}
        disabled={!hasChanges || !hasAccess}
        onClick={this.onClick}
      />
    );
  }
}

export default SaveButton;
