export const LOG_NONE = -1;
export const LOG_ERROR = 0;
export const LOG_WARN = 1;
export const LOG_INFO = 2;
export const LOG_VERBOSE = 3;


const Logger = ({ logLevel = LOG_VERBOSE }) => {
	const Impl = {
		verbose() {
			if (logLevel < LOG_VERBOSE) {
				return;
			}

			console.log(...arguments);
		},

		info() {
			if (logLevel < LOG_INFO) {
				return;
			}

			console.info(...arguments);
		},

		warn() {
			if (logLevel < LOG_WARN) {
				return;
			}

			console.warn(...arguments);
		},

		error() {
			if (logLevel < LOG_ERROR) {
				return;
			}

			console.error(...arguments);
		},
	};

	return Impl;
};

export default Logger;
