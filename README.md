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
import { IconArrowDown } from 'airtame-icons';

class MyComponent extends React.Component {
  render() {
    return (
      <div>
        <IconArrowDown className="your-class" />
      </div>
    );
  }
}
```

As SVG with Webpack

```javascript
const iconName = require('airtame-icons/icon-arrow-down.svg');
```

You can also eject all the icons to copy them locally to the desired destination in your project

```bash
$ airtame-icons eject src/assets
```

A `<symbol>` sprite is also available if needed. After ejecting, you can use the SVG Makrup in `airtame-icons-sprite.svg` and use it in your DOM

```html
<svg class="icon">
  <use xlink:href="#icon-arrow-down" />
</svg>
```

If you only want to eject the sprite, you can do it by passing the `--sprite` option to the eject command

```bash
$ airtame-icons eject --sprite src/assets
```

## Development

To add new icons, icons simply need to be dropped in the `src/icons` directory.

Then, run the following command to test the icon

```
npm run dev
```

This will optimize and export all icons as React components, as well as generate an `icon-map.js` file, which will be used to generate the preview website showcasing all icons. The showcase site will be compiled and opened automatically using webpack-dev-server.
