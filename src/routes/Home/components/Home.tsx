import { Component } from 'react';

import DemoIntro from 'routes/Home/components/DemoIntro';
import InstallPrompt from 'components/InstallPrompt';
import NewUserIntro from 'routes/Home/components/NewUserIntro';
import WidgetLayout from 'routes/Home/components/WidgetLayout';

import '../style.css';


class Home extends Component {
  static displayName = 'Home';

  render() {
    return (
      <div id="home">
        <DemoIntro/>
        <NewUserIntro/>
        <InstallPrompt/>
        <WidgetLayout { ...this.props }/>
      </div>
    );
  }
}

export default Home;