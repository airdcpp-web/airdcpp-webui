'use strict';

import React from 'react';

import { default as ReactLinkify, linkify } from 'react-linkify';
import ReactEmoji from 'react-emoji';
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

// Parses links from plain text and optionally emoticons as well
const TextDecorator = ({ emojify = false, text }, { routerLocation }) => (
	<ReactLinkify 
		properties={{ 
			target: '_blank',
			rel: 'noreferrer',
			onClick: evt => onClickLink(evt, routerLocation),
		}}
	>
		{ !emojify ? text : ReactEmoji.emojify(text, {
			emojiType: 'twemoji'
		})}
	</ReactLinkify>
);

TextDecorator.contextTypes = {
	routerLocation: React.PropTypes.object.isRequired,
};

export default TextDecorator;