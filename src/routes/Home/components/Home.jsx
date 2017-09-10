import React from 'react';
import createReactClass from 'create-react-class';
import { LocationContext } from 'mixins/RouterMixin';

import DemoIntro from './DemoIntro';
import NewUserIntro from './NewUserIntro';
import WidgetLayout from './WidgetLayout';

import '../style.css';


const Home = createReactClass({
  displayName: 'Home',
  mixins: [ LocationContext ],

  render() {
    return (
      <div id="home">
        <DemoIntro/>
        <NewUserIntro/>
        <WidgetLayout/>
      </div>
    );
  },
});

export default Home;