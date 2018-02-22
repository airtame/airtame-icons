import React, { Component } from 'react';
import { render } from 'react-dom';
import * as Icons from '../../build';
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
        <h1>Airtame Icons</h1>
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
              <li
                className="icon-container"
                key={icon.fileName}
                title={
                  isFace
                    ? 'This icon needs some styles for the inner elements to be displayed'
                    : null
                }
              >
                <div className="icon-container-wrapper">
                  <h2>
                    {icon.fileName}
                    {isFace ? <span>*</span> : null}
                  </h2>
                  <Icon className={isFace ? 'face' : null} />
                  <h3>
                    <span>Component</span>&nbsp;
                    <p className="code">{`<${icon.componentName} />`}</p>
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
