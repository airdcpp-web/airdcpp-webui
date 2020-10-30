'use strict';
import * as React from 'react';


interface ImageFileProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  url: string;
}

const ImageFile: React.FC<ImageFileProps> = ({ url }) => (
  <img 
    src={ url }
    style={{
      maxWidth: '100%',
      maxHeight: '100%',
    }}
  />
);

export { ImageFile };