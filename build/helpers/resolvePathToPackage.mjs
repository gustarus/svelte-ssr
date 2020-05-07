import fs from 'fs-extra';
import path from 'path';
export default function resolvePathToPackage(directory) {
    const possible = path.resolve(directory, 'package.json');
    if (fs.existsSync(possible)) {
        return directory;
    }
    // if we are already in the tree root
    if (directory === '/') {
        return undefined;
    }
    // step out of the current directory
    const parent = path.dirname(directory);
    return resolvePathToPackage(parent);
}
