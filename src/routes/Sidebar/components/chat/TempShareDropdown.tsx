import * as React from 'react';
import cx from 'classnames';

import SectionedDropdown from '@/components/semantic/SectionedDropdown';
import MenuSection from '@/components/semantic/MenuSection';
import MenuItemLink from '@/components/semantic/MenuItemLink';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import DataProviderDecorator, {
  DataProviderDecoratorChildProps,
} from '@/decorators/DataProviderDecorator';
import ShareConstants from '@/constants/ShareConstants';
import NotificationActions from '@/actions/NotificationActions';
import IconConstants from '@/constants/IconConstants';
import FileIcon from '@/components/icon/FileIcon';

import { translate, toI18nKey } from '@/utils/TranslationUtils';
import { useTranslation } from 'react-i18next';

export interface TempShareDropdownProps {
  handleUpload: (evt: React.SyntheticEvent<any>) => void;
  style?: React.CSSProperties;
  className?: string;

  // Allows temporarily replacing the content without
  // the need to refetch all temp share data
  overrideContent?: React.ReactElement | null;
}

interface DataProps {
  files: API.TempShareItem[];
}

type Props = TempShareDropdownProps & DataProps & DataProviderDecoratorChildProps;

const getDropdownItem = (
  file: API.TempShareItem,
  onClick: (p: API.TempShareItem) => void,
) => {
  let title = file.name;
  if (file.user) {
    title += ` (${file.user.nicks})`;
  }

  return (
    <MenuItemLink
      key={file.id}
      onClick={() => onClick(file)}
      icon={<FileIcon typeInfo={file.type} />}
    >
      {title}
    </MenuItemLink>
  );
};

const TempShareDropdown = React.memo<Props>(function TempShareDropdown({
  files,
  handleUpload,
  style,
  className,
  overrideContent,
  socket,
}) {
  const { t } = useTranslation();

  if (!!overrideContent) {
    return overrideContent;
  }

  const onClickFile = (file: API.TempShareItem) => {
    socket
      .delete(`${ShareConstants.TEMP_SHARES_URL}/${file.id}`)
      .then((res) => {
        NotificationActions.success({
          title: t(toI18nKey('fileNoLongerShared', UI.Modules.COMMON), {
            defaultValue: 'File {{file.name}} is no longer shared',
            replace: {
              file,
            },
          }),
        });
      })
      .catch((e) => {
        NotificationActions.apiError('Failed to remove shared item', e);
      });
  };

  const classNames = cx('top left pointing actions', className);

  return (
    <SectionedDropdown
      className={classNames}
      triggerIcon="plus"
      button={true}
      contextElement=".message-view"
    >
      <MenuItemLink onClick={handleUpload} icon={IconConstants.UPLOAD}>
        {translate('Send files', t, UI.Modules.COMMON)}
      </MenuItemLink>
      <MenuSection
        caption={translate('Remove shared file', t, UI.Modules.COMMON)}
        icon={IconConstants.FILE}
      >
        {files.map((p) => getDropdownItem(p, onClickFile))}
      </MenuSection>
    </SectionedDropdown>
  );
});

export default DataProviderDecorator<TempShareDropdownProps, DataProps>(
  TempShareDropdown,
  {
    urls: {
      files: ShareConstants.TEMP_SHARES_URL,
    },
    onSocketConnected: (addSocketListener, { refetchData }) => {
      addSocketListener(ShareConstants.MODULE_URL, ShareConstants.TEMP_ITEM_ADDED, () =>
        refetchData(),
      );
      addSocketListener(ShareConstants.MODULE_URL, ShareConstants.TEMP_ITEM_REMOVED, () =>
        refetchData(),
      );
    },
    loaderText: null,
  },
);
