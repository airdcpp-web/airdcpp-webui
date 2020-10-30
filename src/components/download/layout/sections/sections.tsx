import * as React from 'react';

import PathList from './PathList';
import AccordionTargets from './AccordionTargets';

import * as API from 'types/api';

import { TFunction } from 'i18next';
import { PathDownloadHandler } from '../../types';


export interface DownloadSectionChildProps {
  t: TFunction;
  downloadHandler: PathDownloadHandler;
}

export interface DownloadSection {
  name: string;
  key: string;
  list?: string[] | API.GroupedPath[];
  component: React.ComponentType<DownloadSectionChildProps>;
}

interface PathInfo {
  sharePaths: API.GroupedPath[];
  favoritePaths: API.GroupedPath[];
  historyPaths: string[];
  dupePaths: string[];
}

export const getDownloadSections = (pathInfo: PathInfo) => {
  const { sharePaths, favoritePaths, historyPaths, dupePaths } = pathInfo;

  const sections: DownloadSection[] = [
    {
      name: 'Previous',
      key: 'history',
      list: historyPaths,
      component: ({ downloadHandler, t }) => (
        <PathList 
          paths={ historyPaths } 
          downloadHandler={ downloadHandler }
          t={ t }
        />
      )
    }, {
      name: 'Shared',
      key: 'shared',
      list: sharePaths,
      component: ({ downloadHandler, t }) => (
        <AccordionTargets 
          groupedPaths={ sharePaths } 
          downloadHandler={ downloadHandler }
          t={ t }
        />
      )
    }, {
      name: 'Favorites',
      key: 'favorites',
      list: favoritePaths,
      component: ({ downloadHandler, t }) => (
        <AccordionTargets 
          groupedPaths={ favoritePaths } 
          downloadHandler={ downloadHandler }
          t={ t }
        />
      )
    }, {
      name: 'Dupes',
      key: 'dupes',
      list: dupePaths,
      component: ({ downloadHandler, t }) => (
        <PathList 
          paths={ dupePaths } 
          downloadHandler={ downloadHandler }
          t={ t }
        />
      )
    }
  ];

  return sections;
};
