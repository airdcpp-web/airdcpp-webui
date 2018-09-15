import React from 'react';

import DemoIntro from 'routes/Home/components/DemoIntro';
import NewUserIntro from 'routes/Home/components/NewUserIntro';
import WidgetLayout from 'routes/Home/components/WidgetLayout';

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