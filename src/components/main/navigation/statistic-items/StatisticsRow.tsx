import * as React from 'react';

import Icon, { IconType, CornerIconType } from '@/components/semantic/Icon';

interface StatisticsRowProps {
  icon: IconType;
  cornerIcon?: CornerIconType;
  bytes: number;
  formatter: (bytes: number) => React.ReactNode;
  label: string;
}

export const StatisticsRow: React.FC<StatisticsRowProps> = ({
  icon,
  cornerIcon,
  bytes,
  formatter,
  label,
}) => {
  if (bytes === 0) {
    return null;
  }

  return (
    <div className="item">
      {!!cornerIcon ? (
        <i
          className="icon"
          style={{
            paddingLeft: '0.2em',
          }}
        >
          <Icon icon={icon} cornerIcon={cornerIcon} title={label} />
        </i>
      ) : (
        <Icon icon={icon} title={label} />
      )}
      <div
        className="content"
        style={{
          paddingLeft: '.2em',
        }}
      >
        <div className="header">{formatter(bytes)}</div>
      </div>
    </div>
  );
};
