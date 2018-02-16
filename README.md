# Airtame Icons

This is a compilation of icons to be used as part of the Airtame design and brand guidelines.

## Installation

```bash
$ npm install --save airtame-icons
```

or

```bash
$ yarn add airtame-icons
```

## Usage

As React components

```javascript
import React from 'react';
import { IconName } from 'airtame-icons';

class MyComponent extends React.Component {
  render() {
    return (
      <div>
        <IconName className="your-class" />
      </div>
    );
  }
}
```

As SVG with Webpack

```javascript
const iconName = require('airtame-icons/icon-name.svg');
```

You can also eject all the icons to copy them locally to the desired destination in your project

```bash
$ airtame-icons eject src/assets
```
