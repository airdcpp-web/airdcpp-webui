import PropTypes from 'prop-types';
import React from 'react';

import './style.css';

import 'semantic-ui-css/components/breadcrumb.min.css';

import { Section, SelectedSection, SelectedNameFormatter } from './Section';



interface BrowserBarProps {
  itemClickHandler: (name: string) => void;
  rootName?: string;
  rootPath: string;
  separator: string;
  path: string;
  selectedNameFormatter?: SelectedNameFormatter;
  entityId?: string; // Used just for re-rendering
}

class BrowserBar extends React.PureComponent<BrowserBarProps> {
  static propTypes = {
    /**
     * Function handling the path selection. Receives the selected path as argument.
     */
    itemClickHandler: PropTypes.func.isRequired,

    /**
     * Function handling the path selection. Receives the selected path as argument.
     */
    rootName: PropTypes.string,

    /**
     * Root path that will be appended to the beginning of the returned path
     */
    rootPath: PropTypes.string.isRequired,

    /**
     * Root path that will be appended to the beginning of the returned path
     */
    separator: PropTypes.string.isRequired,

    /**
     * Current path to display
     */
    path: PropTypes.string.isRequired,

    /**
     * Function returning the formated element for the current directory name
     * Receives the caption element and path token as parameters
     */
    selectedNameFormatter: PropTypes.func,
  };

  breadcrumb: HTMLDivElement;
  wrapper: HTMLDivElement;

  static defaultProps = {
    rootName: 'Root',
  };

  state = {
    overflow: false,
  };

  componentDidMount() {
    this.checkOverflow();
  }

  componentDidUpdate() {
    this.checkOverflow();
  }

  checkOverflow = () => {
    const newOverflow = this.breadcrumb.clientWidth > this.wrapper.clientWidth;
    if (newOverflow !== this.state.overflow) {
      this.setState({ overflow: newOverflow });
    }
  }

  onClick = (token: string, index: number) => {
    const tokens = this.tokenizePath();
    let path = this.props.rootPath;

    for (let i = 1; i <= index; i++) {
      path += tokens[i] + this.props.separator;
    }

    this.props.itemClickHandler(path);
  }

  formatName = (token: string) => {
    return (
      <div className="section-caption">
        { this.props.rootPath === token ? this.props.rootName : token }
      </div>
    );
  }

  formatSection = (token: string, index: number) => {
    return (
      <Section 
        key={ token + index } 
        onClick={ () => this.onClick(token, index) }
        caption={ this.formatName(token) }
      />
    );
  }

  tokenizePath = () => {
    const { path, separator, rootPath } = this.props;

    return [ rootPath, ...path.split(separator).filter(t => t.length !== 0) ];
  }

  parsePath = () => {
    const tokens = this.tokenizePath();
    return {
      current: tokens[tokens.length - 1],
      tokens: tokens.slice(0, tokens.length - 1),
    };
  }

  render() {
    const { current, tokens } = this.parsePath();

    const className = this.state.overflow ? 'overflow' : '';
    return (
      <div className={ 'ui segment browserbar ' + className }>
        <div className="path-navigation" ref={ c => this.wrapper = c! }>
          <div className="ui breadcrumb" ref={ c => this.breadcrumb = c! }>
            { tokens.map(this.formatSection) }
          </div>
        </div>

        <SelectedSection
          key={ current }
          selectedNameFormatter={ this.props.selectedNameFormatter }
          caption={ this.formatName(current) }
          token={ current }
        />
      </div>
    );
  }
}

export default BrowserBar;
