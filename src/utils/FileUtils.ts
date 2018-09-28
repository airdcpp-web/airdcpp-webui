
export const getFilePath = (fullPath: string): string => {
  return fullPath.replace(/[^\\\/]*$/, '');
};

export const getFileName = (fullPath: string): string => {
  return fullPath.replace(/^.*[\\\/]/, '');
};

export const isDirectory = (fullPath: string): boolean => {
  return fullPath ? !!fullPath.match(/[\\\/]$/) : false;
};

export const getParentPath = (fullPath: string): string => {
  if (isDirectory(fullPath)) {
    return fullPath.replace(/[^\\\/]+[\\\/]$/, '');
  }

  return getFilePath(fullPath);
};

export const getLastDirectory = (fullPath: string): string => {
  const path = isDirectory(fullPath) ? fullPath : getParentPath(fullPath);
  const result = path.match(/([^\\\/]+)[\\\/]$/);
  return result ? result[1] : fullPath;
};
