import React from 'react';
import CountLabel from 'components/CountLabel';

const MenuIcon = ({ urgencies, className, onClick }) => (
	<div className={ 'icon-menu ' + className }> 
		<i className="content link icon" onClick={onClick}/>
		<CountLabel 
			urgencies={ urgencies }
			size="mini"
			empty={ true }
			circular={ true }
		/>
	</div>
);

MenuIcon.defaultProps = {
	className: '',
};

MenuIcon.propTypes = {
	urgencies: React.PropTypes.object,
};

export default MenuIcon;
