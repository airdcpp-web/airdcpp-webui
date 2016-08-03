import React from 'react';

import DemoIntro from './DemoIntro';
import NewUserIntro from './NewUserIntro';

//import ReactGridLayout from 'react-grid-layout';
//import RSS from './widgets/RSS';

import '../style.css';


/*var layout = [
  { i: 'a', x: 0, y: 0, w: 4, h: 2, static: true },
  { i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
  { i: 'c', x: 4, y: 0, w: 1, h: 2 }
];*/

const Home = React.createClass({
	// TODO: add real content
	render() {
		return (
			<div id="home">
				<DemoIntro/>
				<NewUserIntro/>

	      {/*<ReactGridLayout className="ui cards layout" layout={layout} cols={12} rowHeight={30} width={1200}>
	        <RSS key={'a'}/>
	        <div key={'b'} className="card">
	        	b
	        </div>
	        <div key={'c'} className="card">
	        	c
	        </div>
	      </ReactGridLayout>*/}
			</div>
		);
	}
});

export default Home;