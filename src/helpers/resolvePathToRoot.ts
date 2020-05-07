import resolvePathToPackage from './resolvePathToPackage';

export default function resolvePathToRoot(): string | undefined {
  return resolvePathToPackage(__dirname);
}
