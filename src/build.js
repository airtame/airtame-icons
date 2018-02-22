/* eslint-disable no-console */
const path = require('path');
const fse = require('fs-extra');
const Svgo = require('svgo');
const svgr = require('svgr').default;
const svgstore = require('svgstore');

const svgoConfig = require('./util/svgo-config');
const iconMap = [];

const optimizeSvgs = (rootDir, outDir) => {
  const svgs = fse.readdirSync(rootDir);
  const svgo = new Svgo({ plugins: svgoConfig });
  const promises = [];

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

const buildReactComponents = (buildDir, releaseDir) => {
  const svgs = fse.readdirSync(releaseDir);
  const outFile = `${buildDir}/index.js`;
  const promises = [];

  // Create the file for the components
  fse.writeFileSync(outFile, '');

  svgs.forEach(svg => {
    promises.push(
      new Promise((resolve, reject) => {
        const svgFile = `${releaseDir}/${svg}`;
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
              const exportedComponent = `export ${componentName} from './${componentName}.js';\n`;
              fse.appendFile(outFile, exportedComponent, err => {
                if (err) {
                  reject(err);
                }
                const componentFile = `${buildDir}/${componentName}.js`;
                fse.writeFileSync(componentFile, component);
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

const buildSVGSprite = releaseDir => {
  const sprite = svgstore();

  iconMap.forEach(icon => {
    sprite.add(
      icon.fileName.split('.svg')[0],
      fse.readFileSync(`${releaseDir}/${icon.fileName}`, 'utf8')
    );
    console.log(`\x1b[34m${icon.fileName}\x1b[0m added to sprite`);
  });

  return fse.writeFileSync(`${releaseDir}/airtame-icons-sprite.svg`, sprite);
};

const capitalize = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const build = () => {
  const rootDir = path.resolve(__dirname, '../');
  const iconsDir = path.resolve(__dirname, 'icons');
  const buildDir = path.resolve(__dirname, '../build');
  const releaseDir = path.resolve(__dirname, '../release');

  // Create out dir if it doesn't exist
  if (!fse.existsSync(buildDir)) {
    fse.mkdirSync(buildDir);
  }

  // Create out dir if it doesn't exist
  if (!fse.existsSync(releaseDir)) {
    fse.mkdirSync(releaseDir);
  }

  console.log('\x1b[1m** Optimizing SVGs **\x1b[0m');
  Promise.all(optimizeSvgs(iconsDir, releaseDir))
    .then(() => {
      console.log('\n\x1b[1m** Building React Components **\x1b[0m');
      const promises = buildReactComponents(buildDir, releaseDir);
      return Promise.all(promises).catch(err => err);
    })
    .then(() => {
      console.log('\n\x1b[1m** Building SVG Sprite **\x1b[0m');
      buildSVGSprite(releaseDir);
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
