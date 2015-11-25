
export default {
	getFilePath: function (fullPath) {
		return fullPath.replace(/[^\\\/]*$/, '');
	},

	getFileName: function (fullPath) {
		return fullPath.replace(/^.*[\\\/]/, '');
	},

	isDirectory: function (fullPath) {
		return fullPath.match(/[\\\/]$/);
	},

	getParentPath: function (fullPath, FileUtils) {
		if (FileUtils.isDirectory(fullPath)) {
			return fullPath.replace(/[^\\\/]+[\\\/]$/, '');
		}
			
		return FileUtils.getFilePath(fullPath);
	},


	getLastDirectory: function (fullPath, FileUtils) {
		const path = FileUtils.isDirectory(fullPath) ? fullPath : FileUtils.getParentPath(fullPath);
		return path.match(/([^\\\/]+)[\\\/]$/)[1];
	},
}
;
