import path from 'path';
import fse from 'fs-extra';
import rimraf from 'rimraf';

import { optimizeSvgs, buildReactComponents, buildSVGSprite } from '../src/build';

describe('SVG optimization and componentization', () => {
  afterEach(done => {
    const buildDir = path.resolve(__dirname, '../test-build');
    const releaseDir = path.resolve(__dirname, '../test-release');

    rimraf(buildDir, () => {
      rimraf(releaseDir, () => {
        done();
      });
    });
  });

  test('Optimizes all the icons', done => {
    const srcDir = path.resolve(__dirname, './icons');
    const outDir = path.resolve(__dirname, '../test-build');
    const promises = optimizeSvgs(srcDir, outDir);

    if (!fse.existsSync(outDir)) {
      fse.mkdirSync(outDir);
    }

    Promise.all(promises).then(() => {
      const numSrcFiles = fse.readdirSync(srcDir).length;
      const numOutFiles = fse.readdirSync(outDir).length;
      expect(numSrcFiles).toBe(numOutFiles);
      done();
    });
  });

  test('Componentizes all the icons', done => {
    const srcDir = path.resolve(__dirname, './icons');
    const buildDir = path.resolve(__dirname, '../test-build');
    const releaseDir = path.resolve(__dirname, '../test-release');

    if (!fse.existsSync(buildDir)) {
      fse.mkdirSync(buildDir);
    }

    if (!fse.existsSync(releaseDir)) {
      fse.mkdirSync(releaseDir);
    }

    const optimizationPromises = optimizeSvgs(srcDir, releaseDir);

    Promise.all(optimizationPromises)
      .then(() => {
        const componentizationPromises = buildReactComponents(buildDir, releaseDir);
        return Promise.all(componentizationPromises);
      })
      .then(() => {
        const numSVGs = fse.readdirSync(srcDir).length;
        const numComponents = fse.readdirSync(buildDir).length;

        expect(numSVGs + 1).toBe(numComponents);
        done();
      });
  });

  test('Build svg sprite', done => {
    const srcDir = path.resolve(__dirname, './icons');
    const releaseDir = path.resolve(__dirname, '../test-release');

    if (!fse.existsSync(releaseDir)) {
      fse.mkdirSync(releaseDir);
    }

    const optimizationPromises = optimizeSvgs(srcDir, releaseDir);
    const spritePromise = buildSVGSprite(releaseDir);

    Promise.all(optimizationPromises)
      .then(() => spritePromise)
      .then(() => {
        const svgs = fse.readdirSync(releaseDir);
        const hasSprite = svgs.includes('airtame-icons-sprite.svg');
        expect(hasSprite).toBe(true);
        done();
      });
  });
});
