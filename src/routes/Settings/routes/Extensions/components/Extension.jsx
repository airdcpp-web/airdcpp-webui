import React from 'react';
import Moment from 'moment';

import ExtensionActions from 'actions/ExtensionActions';
import ExtensionConstants from 'constants/ExtensionConstants';

import ActionButton from 'components/ActionButton';
import ExternalLink from 'components/ExternalLink';
import Icon from 'components/semantic/Icon';

import versionCompare from 'compare-versions';

import 'semantic-ui/components/item.min.css';


const InstallButton = ({ npmPackage, installedPackage, hasUpdate }) => {
	if (installedPackage && !hasUpdate) {
		return null;
	}

	return (
		<ActionButton
			action={ hasUpdate ? ExtensionActions.updateNpm : ExtensionActions.installNpm }
			className="right floated primary"
			itemData={ npmPackage }
		/>
	);
};

const Version = ({ title, packageInfo, className }) => {
	if (!packageInfo) {
		return null;
	}

	return (
		<div className={ className }>
			{ (title ? title + ': ' : '') }
			<span> 
				{ packageInfo.version + (packageInfo.date ? ' (published ' + Moment(packageInfo.date).from(Moment()) + ')' : '') }
			</span>
		</div>
	);
};

const formatAuthor = (npmPackage, installedPackage) => {
	if (installedPackage && installedPackage.author) {
		return 'by ' + installedPackage.author;
	}

	if (npmPackage) {
		return 'by ' + npmPackage.publisher.username;
	}

	return null;
};

const getCornerIcon = (installedPackage, hasUpdate) => {
	if (!installedPackage) {
		return null;
	}

	if (hasUpdate) {
		return 'yellow warning circle';
	}

	if (!installedPackage.managed) {
		return 'blue external square';
	}

	return 'green check circle';
};


const Extension = ({ npmPackage, installedPackage }) => {
	const hasUpdate = installedPackage && npmPackage && versionCompare(installedPackage.version, npmPackage.version) < 0;
	const name = npmPackage ? npmPackage.name : installedPackage.name;
	return (
		<div className="item extension">
			<div className="ui image">
				<Icon 
					icon="puzzle" 
					size="huge" 
					cornerIcon={ getCornerIcon(installedPackage, hasUpdate) }
				/>
			</div>
			<div className="content">
				<a className="header">
					{ name }
				</a>
				<div className="meta author">
					{ formatAuthor(npmPackage, installedPackage) }
				</div>
				<div className="description">
					<span>{ npmPackage ? npmPackage.description : installedPackage.description }</span>
				</div>
				<div className="extra version">
					<Version 
						className="npm"
						title="Latest version" 
						packageInfo={ npmPackage }
					/>
					<div>
						{ !npmPackage && (installedPackage && !installedPackage.managed ? 'Unmanaged extension' : 'Non-listed extension') }
					</div>
					<Version 
						className={ npmPackage ? (!hasUpdate ? 'latest' : 'outdated') : null }
						title="Installed version" 
						packageInfo={ installedPackage }
					/>
				</div>
				<div className="extra buttons">
					{ installedPackage && (
						<ActionButton
							action={ ExtensionActions.remove }
							className="right floated"
							itemData={ installedPackage }
						/>
					) }
					{ npmPackage && (
						<InstallButton
							npmPackage={ npmPackage }
							installedPackage={ installedPackage }
							hasUpdate={ hasUpdate }
						/>
					) }
					{ npmPackage && (
						<ExternalLink className="ui right floated button" url={ ExtensionConstants.NPM_HOMEPAGE_URL + name }>
							Read more
						</ExternalLink> 
					) }
					{ installedPackage && (
							<ActionButton
								action={ installedPackage.running ? ExtensionActions.stop : ExtensionActions.start }
								className="right floated"
								itemData={ installedPackage }
							/>
						) }
					{ installedPackage && (
							<ActionButton
								action={ ExtensionActions.configure }
								className="right floated"
								itemData={ installedPackage }
							/>
						) }
				</div>
			</div>
		</div>
	);
};

Extension.propTypes = {
	npmPackage: React.PropTypes.shape({
		name: React.PropTypes.string.isRequired,
		description: React.PropTypes.string.isRequired,
		version: React.PropTypes.string.isRequired,
		date: React.PropTypes.string,
		publisher: React.PropTypes.shape({
			username: React.PropTypes.string,
		}),
	}),
	installedPackage: React.PropTypes.shape({
		name: React.PropTypes.string.isRequired,
		description: React.PropTypes.string.isRequired,
		version: React.PropTypes.string.isRequired,
		author: React.PropTypes.string,
	}),
};

export default Extension;