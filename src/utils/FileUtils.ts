
export const getFilePath = (fullPath) => {
  return fullPath ? fullPath.replace(/[^\\\/]*$/, '') : undefined;
};

export const getFileName = (fullPath) => {
  return fullPath ? fullPath.replace(/^.*[\\\/]/, '') : undefined;
};

export const isDirectory =(fullPath) => {
  return fullPath ? fullPath.match(/[\\\/]$/) : false;
};

export const getParentPath = (fullPath) => {
  if (!fullPath) {
    return undefined;
  }

  if (isDirectory(fullPath)) {
    return fullPath.replace(/[^\\\/]+[\\\/]$/, '');
  }
		
  return getFilePath(fullPath);
};

export const getLastDirectory = (fullPath) => {
  if (!fullPath) {
    return undefined;
  }

  const path = isDirectory(fullPath) ? fullPath : getParentPath(fullPath);
  const result = path.match(/([^\\\/]+)[\\\/]$/);
  return result ? result[1] : fullPath;
};
