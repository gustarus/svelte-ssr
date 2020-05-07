import resolvePathToPackage from './resolvePathToPackage';

export default function resolvePathToProject(): string | undefined {
  return resolvePathToPackage(process.cwd());
}
