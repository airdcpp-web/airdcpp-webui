
const FileUtils = {
	getFilePath: function (fullPath) {
		return fullPath ? fullPath.replace(/[^\\\/]*$/, '') : undefined;
	},

	getFileName: function (fullPath) {
		return fullPath ? fullPath.replace(/^.*[\\\/]/, '') : undefined;
	},

	isDirectory: function (fullPath) {
		return fullPath ? fullPath.match(/[\\\/]$/) : false;
	},
};

const getParentPath = (fullPath) => {
	if (!fullPath) {
		return undefined;
	}

	if (FileUtils.isDirectory(fullPath)) {
		return fullPath.replace(/[^\\\/]+[\\\/]$/, '');
	}
		
	return FileUtils.getFilePath(fullPath);
};

const getLastDirectory = (fullPath) => {
	if (!fullPath) {
		return undefined;
	}

	const path = FileUtils.isDirectory(fullPath) ? fullPath : FileUtils.getParentPath(fullPath);
	const result = path.match(/([^\\\/]+)[\\\/]$/);
	return result ? result[1] : fullPath;
};

export default Object.assign(FileUtils, {
	getLastDirectory,
	getParentPath,
});
