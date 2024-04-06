import { packageDirectorySync } from 'pkg-dir';
import { Assert } from '../type/assert.js';

export class Package {
  constructor(private readonly assert: Assert) {}

  rootDir() {
    const pkgDir = packageDirectorySync();

    this.assert.string(pkgDir);

    return pkgDir;
  }

  static build() {
    return new Package(new Assert());
  }
}
