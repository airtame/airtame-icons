import React from 'react';
import { render } from 'react-dom';
import * as Icons from '../../build';
import iconMap from '../../icon-map';

import './style.scss';

const App = props => {
  return (
    <div className="wrapper">
      <h1>Airtame Icons</h1>
      <ul className="icons-wrapper">
        {iconMap.map(icon => {
          const Icon = Icons[icon.componentName];
          return (
            <li className="icon-container" key={icon.fileName}>
              <h2>{icon.fileName}</h2>
              <Icon />
              <h3>
                <span>Component</span>&nbsp;
                <p className="code">{`<${icon.componentName} />`}</p>
              </h3>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

render(<App />, document.getElementById('root'));
