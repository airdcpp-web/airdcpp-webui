/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Tobias Koppers @sokra
 Modified version, originally created by Richard Scarrott @richardscarrott
 */

var loaderUtils = require("loader-utils");
var LoaderDependency = require("webpack/lib/dependencies/LoaderDependency");

module.exports = function() {};
module.exports.pitch = function(remainingRequest) {
	this.cacheable && this.cacheable();
	var query = loaderUtils.getOptions(this) || {};
	if(query.name) {
		var options = {
			context: query.context || this.rootContext || this.options && this.options.context,
			regExp: query.regExp
		};
		var chunkName = loaderUtils.interpolateName(this, query.name, options);
		var chunkNameParam = ", " + JSON.stringify(chunkName);
	} else {
		var chunkNameParam = '';
	}
	var result;
	if(query.lazy) {
		result = [
			"module.exports = function(successCallback, errorCallback) {\n",
			"	require.ensure([], function() {\n",
			"		successCallback(require(", loaderUtils.stringifyRequest(this, "!!" + remainingRequest), "));\n",
			"	}, function() {\n",
			"		if (errorCallback) errorCallback.apply(this, arguments);\n",
			"	}" + chunkNameParam + ");\n",
			"};"];
	} else {
		result = [
			"var cbs,\n",
			"	data,\n",
			"	error = false;\n",
			"module.exports = function(successCallback, errorCallback) {\n",
			"	errorCallback = errorCallback || function() {};\n",
			"	if (data) {\n",
			"		successCallback(data);\n",
			"	} else {\n",
			"		if (error) {\n",
			"			// Try again.\n",
			"			requireBundle();\n",
			"		}\n",
			"		cbs.push({\n",
			"			success: successCallback,\n",
			"			error: errorCallback\n",
			"		});\n",
			"	}\n",
			"};\n",
			"function requireBundle() {\n",
			"	cbs = [];\n",
			"	require.ensure([], function() {\n",
			"		data = require(", loaderUtils.stringifyRequest(this, "!!" + remainingRequest), ");\n",
			"		for(var i = 0, l = cbs.length; i < l; i++) {\n",
			"			cbs[i].success(data);\n",
			"		}\n",
			"		error = false;\n",
			"		cbs = null;\n",
			"	}, function() {\n",
			"		for(var i = 0, l = cbs.length; i < l; i++) {\n",
			"			cbs[i].error.apply(this, arguments);\n",
			"		}\n",
			"		error = true;\n",
			"		cbs = null;\n",
			"	}" + chunkNameParam + ");\n",
			"}\n",
			"requireBundle();"
		];
	}
	
	if (this._module.type !== "javascript/auto") {
		var nmf = this._compilation.dependencyFactories.get(LoaderDependency);
		this._module.type = "javascript/auto";
		this._module.generator = nmf.getGenerator("javascript/auto");
		this._module.parser = nmf.getParser("javascript/auto");
	}
	
	return result.join("");
};