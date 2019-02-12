import React from 'react';

import DownloadFileBrowser from './DownloadFileBrowser';
import PathList from './PathList';
import AccordionTargets from './AccordionTargets';

import LoginStore from 'stores/LoginStore';

import * as API from 'types/api';
//import * as UI from 'types/ui';

import i18next from 'i18next';


export interface DownloadSectionChildProps {
  t: i18next.TFunction;
  downloadHandler: (path: string) => void;
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

  if (LoginStore.hasAccess(API.AccessEnum.FILESYSTEM_VIEW)) {
    sections.push({
      name: 'Browse',
      key: 'browse',
      component: ({ downloadHandler }) => (
        <DownloadFileBrowser 
          history={ historyPaths } 
          downloadHandler={ downloadHandler }
        />
      )
    });
  }

  return sections;
};
