import * as React from 'react';

import './style.css';

import 'fomantic-ui-css/components/breadcrumb.min.css';
import Icon from '@/components/semantic/Icon';
import LinkButton, { LinkButtonProps } from '@/components/semantic/LinkButton';

export type SelectedNameFormatter = (
  caption: React.ReactNode,
  token: string,
) => React.ReactNode;

export interface SectionProps extends Omit<LinkButtonProps, 'children' | 'onClick'> {
  caption: React.ReactNode;
  onClick: () => void;
}

export const Section: React.FC<SectionProps> = ({ caption, onClick, ...other }) => (
  <div className="path-token">
    <LinkButton className="section" onClick={onClick} {...other}>
      {caption}
    </LinkButton>
    <Icon icon="right chevron divider" />
  </div>
);

interface SelectedSectionProps {
  caption: React.ReactNode;
  selectedNameFormatter?: SelectedNameFormatter;
  token: string;
}

export const SelectedSection: React.FC<SelectedSectionProps> = ({
  selectedNameFormatter,
  caption,
  token,
}) => (
  <div className="ui label current path-token section">
    {!!selectedNameFormatter ? selectedNameFormatter(caption, token) : caption}
  </div>
);
