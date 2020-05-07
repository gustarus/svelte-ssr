import resolvePathToPackage from './resolvePathToPackage';
export default function resolvePathToProject() {
    return resolvePathToPackage(process.cwd());
}
