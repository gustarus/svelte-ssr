import resolvePathToPackage from './resolvePathToPackage';
export default function resolvePathToRoot() {
    return resolvePathToPackage(__dirname);
}
