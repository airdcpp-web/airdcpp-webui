import * as React from 'react';

import Button from '@/components/semantic/Button';
import IconConstants from '@/constants/IconConstants';
import { useTableSelectionContext } from './SelectionContext';

import * as UI from '@/types/ui';

import './style.css';

export interface SelectionFooterBarProps {
  // Called when user wants to download selected items
  onDownload: () => void;
  // Translation function
  t: UI.TranslateF;
  // Optional: disable download button (e.g., while loading)
  downloadDisabled?: boolean;
  // Children (e.g., DupeFilterToggles) to render in the bar
  children?: React.ReactNode;
}

export const SelectionFooterBar: React.FC<SelectionFooterBarProps> = ({
  onDownload,
  t,
  downloadDisabled,
  children,
}) => {
  const { selectedCount, clearSelection } = useTableSelectionContext();

  const hasSelection = selectedCount > 0;

  return (
    <div className={`selection-footer-bar ${hasSelection ? 'has-selection' : ''}`}>
      <div className="selection-left">
        {children}
      </div>
      {hasSelection && (
        <div className="selection-right">
          <span className="selection-count">
            {t('selectedCount', {
              defaultValue: '{{count}} selected',
              count: selectedCount,
            })}
          </span>
          <div className="selection-actions">
            <Button
              className="primary mini"
              icon={IconConstants.DOWNLOAD}
              caption={t('downloadSelected', 'Download')}
              onClick={onDownload}
              disabled={downloadDisabled}
            />
            <Button
              className="basic mini"
              icon={IconConstants.CLOSE}
              caption={t('clearSelection', 'Clear')}
              onClick={clearSelection}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectionFooterBar;
