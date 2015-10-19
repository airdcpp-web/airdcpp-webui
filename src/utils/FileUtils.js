
export default {
  getFilePath: function(fullPath) {
    return fullPath.replace(/[^\\\/]*$/, '');
  },

  getFileName: function(fullPath) {
    return fullPath.replace(/^.*[\\\/]/, '');
  },

  isDirectory: function(fullPath) {
    return fullPath.match(/[\\\/]$/);
  },

  getParentPath: function(fullPath, FileUtils) {
    if (FileUtils.isDirectory(fullPath)) {
      return fullPath.replace(/[^\\\/]+[\\\/]$/, '');
    }
      
    return FileUtils.getFilePath(fullPath);
  },
}