import React, { Component } from 'react';
import { render } from 'react-dom';
import * as Icons from '../../release';
import iconMap from '../../icon-map';

import './style.scss';

/**
 * Application Class
 */
class App extends Component {
  /**
   * Class constructor
   * @param {Object} props - initial props
   */
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: '',
      icons: props.icons,
    };
  }

  /**
   * Filters the icons based on the search result;
   * @param {Event} evt - The search event
   */
  filterSearch = evt => {
    this.setState({ searchQuery: evt.target.value }, () => {
      this.setState({ icons: this.getFilteredIcons() });
    });
  };

  /**
   * Updates the state with the filtered list of icons to be rendered on the screen
   * @return {Array} The array of icons matching the active search query
   */
  getFilteredIcons = () => {
    const { searchQuery } = this.state;
    const { icons } = this.props;

    return !searchQuery.length
      ? icons
      : icons.filter(icon => {
          const iconName = icon.fileName.toLowerCase();
          const query = searchQuery.toLowerCase();

          return iconName.indexOf(query) >= 0;
        });
  };

  /**
   * Render method
   * @return {JSX} The component
   */
  render() {
    const { icons, searchQuery } = this.state;
    const IconSearch = Icons.IconSearch;

    return (
      <div className="wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="airtame-logo">
          <path d="M87.981,68.185c-4.602,2.613-9.773,5.569-19.719,5.569c-9.944,0-15.116-2.956-19.718-5.569c-4.377-2.442-8.468-4.831-16.821-4.831c-8.411,0-12.502,2.33-16.822,4.831c-1.419,0.797-3.182,0.282-3.979-1.079c-0.795-1.422-0.284-3.182,1.08-3.979c4.604-2.615,9.775-5.57,19.721-5.57c9.888,0,15.116,2.955,19.721,5.57c4.374,2.442,8.465,4.83,16.876,4.83s12.501-2.331,16.821-4.83c1.42-0.794,3.183-0.284,3.977,1.081C89.912,65.569,89.402,67.39,87.981,68.185z M11.948,31.816c4.602-2.614,9.773-5.57,19.718-5.57c9.945,0,15.116,2.956,19.718,5.57c4.377,2.442,8.471,4.772,16.822,4.772c8.354,0,12.504-2.33,16.821-4.83c1.42-0.797,3.183-0.283,3.979,1.078c0.794,1.422,0.284,3.186-1.081,3.979c-4.604,2.614-9.775,5.57-19.72,5.57c-9.945,0-15.114-2.956-19.721-5.57c-4.317-2.386-8.408-4.773-16.762-4.773c-8.411,0-12.502,2.33-16.822,4.83c-1.419,0.795-3.182,0.284-3.979-1.081C10.071,34.373,10.584,32.61,11.948,31.816z" />
        </svg>
        <h1>Airtame Icons</h1>
        <a href="https://github.com/airtame/airtame-icons" className="github-ribbon" ariaLabel="View source on Github">
          <svg width="80" height="80" viewBox="0 0 250 250">
            <path className="triangle" d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
            <path className="octo-arm" d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" />
            <path className="octo-body" d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" />
          </svg>
        </a>
        <div className="search-box">
          <input
            value={searchQuery}
            onChange={this.filterSearch}
            placeholder="Search for an icon"
          />
          <IconSearch />
        </div>
        <ul className="icons-wrapper">
          {icons.map(icon => {
            const Icon = Icons[icon.componentName];

            const isFace = icon.fileName.indexOf('-face') >= 0;

            return (
              <li className="icon-container" key={icon.fileName}>
                <div className="icon-container-wrapper">
                  <h2 title={icon.fileName}>
                    {icon.fileName}
                    {isFace ? <span title="This is a multi-color icon">*</span> : null}
                  </h2>
                  <Icon className={isFace ? 'face' : null} />
                  <h3>
                    <span>Component</span>&nbsp;
                    <p className="code" title={`<${icon.componentName} />`}>{`<${
                      icon.componentName
                    } />`}</p>
                  </h3>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

render(<App icons={iconMap} />, document.getElementById('root'));
