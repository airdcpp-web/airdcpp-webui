const MODULE_URL = 'extensions';

export default {
	MODULE_URL: MODULE_URL,
	EXTENSIONS_URL: MODULE_URL,
	DOWNLOAD_URL: MODULE_URL + '/download',

	ENGINES_URL: MODULE_URL + '/engines',
	ENGINES_STATUS_URL: MODULE_URL + '/engines/status',

	DEFAULT_ENGINE: 'node',

	STARTED: 'extension_started',
	STOPPED: 'extension_stopped',

	ADDED: 'extension_added',
	REMOVED: 'extension_removed',
	UPDATED: 'extension_updated',

	INSTALLATION_STARTED: 'extension_installation_started',
	INSTALLATION_SUCCEEDED: 'extension_installation_succeeded',
	INSTALLATION_FAILED: 'extension_installation_failed',

	NPM_PACKAGES_URL: 'https://npm.airdcpp.net/-/v1/search?text=keywords:airdcpp-extensions-public&size=100',
	NPM_PACKAGE_URL: 'https://npm.airdcpp.net/',
	NPM_HOMEPAGE_URL: 'https://www.npmjs.com/package/',
}
;
