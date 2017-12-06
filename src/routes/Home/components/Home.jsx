import React from 'react';
import createReactClass from 'create-react-class';

import DemoIntro from './DemoIntro';
import NewUserIntro from './NewUserIntro';
import WidgetLayout from './WidgetLayout';

import '../style.css';


const Home = createReactClass({
  displayName: 'Home',

  render() {
    return (
      <div id="home">
        <DemoIntro/>
        <NewUserIntro/>
        <WidgetLayout { ...this.props }/>
      </div>
    );
  },
});

export default Home;