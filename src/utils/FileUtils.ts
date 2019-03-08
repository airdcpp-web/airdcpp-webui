
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

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let encoded = (reader.result as string).replace(/^data:(.*;base64,)?/, '');
      if ((encoded.length % 4) > 0) {
        encoded += '='.repeat(4 - (encoded.length % 4));
      }
      resolve(encoded);
    };
    reader.onerror = function (error) {
      reject(error);
    };
  });
};


export const fileToText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      resolve((e.target! as any).result);
    };
    reader.onerror = function (error) {
      reject(error);
    };
  });
};
