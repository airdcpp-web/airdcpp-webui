import React from 'react';

import DemoIntro from './DemoIntro';
import NewUserIntro from './NewUserIntro';
import WidgetLayout from './WidgetLayout';

import '../style.css';


class Home extends React.Component {
  static displayName = 'Home';

  render() {
    return (
      <div id="home">
        <DemoIntro/>
        <NewUserIntro/>
        <WidgetLayout { ...this.props }/>
      </div>
    );
  }
}

export default Home;