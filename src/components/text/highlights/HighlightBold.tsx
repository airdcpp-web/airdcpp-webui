import * as React from 'react';

export interface HighlightBoldProps {
  text: string;
}

export const HighlightBold: React.FC<HighlightBoldProps> = ({ text }) => (
  <span className="highlight bold">{text}</span>
);
