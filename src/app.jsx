import React from 'react'
import { Router, Route, Link } from 'react-router'
import LoginStore from './stores/LoginStore'
import LoginActions from './actions/LoginActions'
import History from './utils/History'

//import $ from 'jquery'
//window.$ = window.jQuery = require('jquery')
//var $ = jQuery = require('jQuery')

//require('semantic-ui')($)

/*let $ = require('jquery');
$.fn.accordion = require('semantic-ui/dist/components/accordion')
$.fn.checkbox = require('semantic-ui/dist/components/checkbox')
$.fn.dimmer = require('semantic-ui/dist/components/dimmer')
$.fn.dropdown = require('semantic-ui/dist/components/dropdown')
$.fn.modal = require('semantic-ui/dist/components/modal')
$.fn.popup = require('semantic-ui/dist/components/popup')
$.fn.transition = require('semantic-ui/dist/components/transition')*/

import SemanticAccordion from 'semantic-ui/dist/components/accordion'
import SemanticCheckbox from 'semantic-ui/dist/components/checkbox'
import SemanticDimmer from 'semantic-ui/dist/components/dimmer'
import SemanticDropdown from 'semantic-ui/dist/components/dropdown'
import SemanticModal from 'semantic-ui/dist/components/modal'
import SemanticPopup from 'semantic-ui/dist/components/popup'
import SemanticTransition from 'semantic-ui/dist/components/transition'

// load tcomb-form without templates and i18n
var t = require('tcomb-form/lib');

var semantic = require('tcomb-form/lib/templates/semantic');
t.form.Form.templates = semantic;

React.initializeTouchEvents(true);

if (LoginStore.token) {
	LoginActions.connect(LoginStore.token);
}

function requireAuth(nextState, replaceState) {
	if (!LoginStore.user) {
	    replaceState({ nextPath: nextState.location.pathname }, '/login', null);
	}
}

var routeConfig = [
  { 
  	path: '/login', 
  	component: require('./components/Login'), 
  }, 
  { 
    component: require('./components/AuthenticatedApp'),
    onEnter: requireAuth,
    childRoutes: [
      require('./routes/Home'),
      require('./routes/FavoriteHubs'),
      require('./routes/Queue'),
      require('./routes/Search'),
    ]
  }
]

React.render(
  <Router history={ History } routes={routeConfig} />,
  document.getElementById('content')
);
