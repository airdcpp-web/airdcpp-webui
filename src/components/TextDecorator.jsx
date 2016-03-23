'use strict';

import React from 'react';

import Linkify from 'react-linkify';
import ReactEmoji from 'react-emoji';

// Parses links from plain text and optionally emoticons as well
const TextDecorator = ({ emojify = false, text }) => (
	<Linkify 
		properties={{ 
			target: '_blank',
			rel: 'noreferrer',
		}}
	>
		{ !emojify ? text : ReactEmoji.emojify(text, {
			emojiType: 'twemoji'
		})}
	</Linkify>
);

export default TextDecorator;