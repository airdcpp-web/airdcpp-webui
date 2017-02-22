'use strict';

import React from 'react';

import { default as ReactLinkify, linkify } from 'react-linkify';

// Convert :D, :P etc. to unicode
// Increases the compressed bundle size by ~20 kilobytes so a simplified custom
// implementation could be considered that would only replace ascii emoticons
import { emojify as emojisToUnicode } from 'react-emojione';

import emoji from 'react-easy-emoji';
import makeTwemojiRenderer from 'react-easy-emoji/lib/makeTwemojiRenderer';

import History from 'utils/History';


linkify.add('magnet:', {
	validate: (text, pos, self) => {
		const tail = text.slice(pos);
		if (!self.re.magnet) {
			self.re.magnet = new RegExp('^(\\?xt=.{64,})');
		}

		if (self.re.magnet.test(tail)) {
			return tail.match(self.re.magnet)[0].length;
		}

		return 0;
	}
});


const onClickLink = (evt, routerLocation) => {
	const uri = evt.target.href;
	if (uri.indexOf('magnet:?xt=urn:tree:tiger:') === 0) {
		evt.preventDefault();

		const tth = uri.slice(26, 26 + 39);
		History.pushUnique({
			pathname: '/search',
			state: {
				searchString: tth,
			}
		}, routerLocation);
	}
};

const emojiRenderer = (code, string, key) => {
	switch (code) {
		case 'a9':      // © copyright
		case 'ae':      // ® registered trademark
		case '2122':    // ™ trademark
			return string;
	}


	const renderer = makeTwemojiRenderer({
		props: {
			style: {
				height: '20px',
				width: '20px',
			}
		}
	});

	return renderer(code, string, key);
};

// Parses links from plain text and optionally emoticons as well
const TextDecorator = ({ emojify = false, text }, { routerLocation }) => (
	<ReactLinkify 
		properties={{ 
			target: '_blank',
			rel: 'noreferrer',
			onClick: evt => onClickLink(evt, routerLocation),
		}}
	>
		{ !emojify ? text : emoji(emojisToUnicode(text, { output: 'unicode' }), emojiRenderer) }
	</ReactLinkify>
);

TextDecorator.propTypes = {
	text: React.PropTypes.string.isRequired,
	emojify: React.PropTypes.bool,
};

TextDecorator.contextTypes = {
	routerLocation: React.PropTypes.object.isRequired,
};

export default TextDecorator;