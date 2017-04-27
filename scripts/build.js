import { transformFileSync } from 'babel-core';
import path from 'path';
import fsp from 'fs-promise';
import { getPackageDirs, getPackageFiles, getBabelConfig } from '../src/utils';

const SRC_DIR = 'src';
const BUILD_DIR = 'build';

const build = async () => {
  const babelConfig = await getBabelConfig();
  const packages = await getPackageDirs();

  return Promise.all(
    packages.map(async (pkg) => {
      const srcDir = path.resolve(pkg, SRC_DIR);
      const buildDir = path.resolve(pkg, BUILD_DIR);
      const files = getPackageFiles(pkg);

      await fsp.ensureDir(buildDir);
      await fsp.emptyDir(buildDir);

      return Promise.all(
        files.map((file) => {
          const relativeToSrcPath = path.relative(srcDir, file);
          const destPath = path.resolve(buildDir, relativeToSrcPath);
          const transformed = transformFileSync(file, babelConfig).code;
          return fsp.outputFile(destPath, transformed);
        }),
      );
    }),
  );
};

build();