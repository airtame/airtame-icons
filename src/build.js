/* eslint-disable no-console */
const path = require('path');
const fse = require('fs-extra');
const Svgo = require('svgo');
const svgr = require('svgr').default;

const svgoConfig = require('./util/svgo-config');
const iconMap = [];

const optimizeSvgs = (rootDir, outDir) => {
  const svgs = fse.readdirSync(rootDir);
  const svgo = new Svgo({ plugins: svgoConfig });
  const promises = [];
  // Create out dir if it doesn't exist
  if (!fse.existsSync(outDir)) {
    fse.mkdirSync(outDir);
  }

  svgs.forEach(svg => {
    const currentFile = `${rootDir}/${svg}`;
    const outFile = `${outDir}/${svg}`;

    promises.push(
      new Promise((resolve, reject) => {
        fse.readFile(currentFile, 'utf8', (err, data) => {
          if (err) {
            reject(err);
          }

          svgo
            .optimize(data, { path: currentFile })
            .then(res => {
              fse.writeFile(outFile, res.data, err => {
                if (err) {
                  reject(err);
                }

                console.log(
                  `\x1b[34m${currentFile}\x1b[0m \x1b[35m=>\x1b[0m \x1b[34m${outFile}\x1b[0m`
                );
                resolve();
              });
            })
            .catch(err => err);
        });
      })
    );
  });

  return promises;
};

const buildReactComponents = rootDir => {
  const svgs = fse.readdirSync(rootDir);
  const outFile = `${rootDir}/index.js`;
  const promises = [];

  // Create the file for the components
  fse.writeFile(outFile, "import React from 'react';\n\n");

  svgs.forEach(svg => {
    promises.push(
      new Promise((resolve, reject) => {
        const svgFile = `${rootDir}/${svg}`;
        const componentName = svg
          .replace('.svg', '')
          .split('-')
          .map(str => capitalize(str))
          .join('');

        iconMap.push({ fileName: svg, componentName });
        fse.readFile(svgFile, 'utf-8', (err, svgCode) => {
          if (err) {
            reject(err);
          }

          svgr(svgCode, { prettier: true, componentName })
            .then(component => {
              const cleanComponent = component
                .replace('import React from "react";\n\n', '')
                .replace(`export default ${componentName};`, '');
              fse.appendFile(outFile, `export ${cleanComponent}`, err => {
                if (err) {
                  reject(err);
                }
                console.log(`Component \x1b[34m<${componentName} />\x1b[0m created`);
                resolve();
              });
            })
            .catch(err => err);
        });
      })
    );
  });

  return promises;
};

const capitalize = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const build = () => {
  const rootDir = path.resolve(__dirname, '../');
  const iconsDir = path.resolve(__dirname, 'icons');
  const outDir = path.resolve(__dirname, '../build');

  console.log('\x1b[1m** Optimizing SVGs **\x1b[0m');
  Promise.all(optimizeSvgs(iconsDir, outDir))
    .then(() => {
      console.log('\n\x1b[1m** Building React Components **\x1b[0m');
      const promises = buildReactComponents(outDir);
      return Promise.all(promises).catch(err => err);
    })
    .then(() => {
      const iconMapFile = `${rootDir}/icon-map.js`;
      fse.writeFile(
        iconMapFile,
        `const iconMap = ${JSON.stringify(iconMap)}; export default iconMap;`
      );
      return iconMap.length;
    })
    .then(numComponents => {
      console.log('\n\x1b[1m\x1b[32m** Success **\x1b[0m');
      console.log(
        `SVGs optimized and turned into React components: \x1b[1m\x1b[32m${numComponents}\x1b[0m`
      );
    })
    .catch(err => console.error(`\x1b[31m\x1b[1mERROR >>>\x1b[0m \x1b[31m${err}\x1b[0m\n`));
};

build();
