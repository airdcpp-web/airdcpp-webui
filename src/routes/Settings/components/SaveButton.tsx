import { useState } from 'react';
import Button from 'components/semantic/Button';

import LoginStore from 'stores/LoginStore';
import classNames from 'classnames';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { SettingSaveState } from '../effects/useSettingSaveContext';

export interface SaveButtonProps {
  saveState: SettingSaveState;
  className?: string;
  settingsT: UI.ModuleTranslator;
}

const SaveButton: React.FC<SaveButtonProps> = ({ saveState, settingsT, className }) => {
  const { local, handleSave, hasChanges } = saveState;
  const [saving, setSaving] = useState(false);

  const onClick = async () => {
    setSaving(true);

    try {
      await handleSave();
    } finally {
      setSaving(false);
    }
  };

  const hasAccess: boolean = local || LoginStore.hasAccess(API.AccessEnum.SETTINGS_EDIT);

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
      loading={saving}
      disabled={!hasChanges || !hasAccess}
      onClick={onClick}
    />
  );
};

export default SaveButton;
