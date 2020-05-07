import colors from 'colors';
import displayCommandStep from './displayCommandStep';
import { TDefaultCommand } from '../types/TDefaultCommand';
import resolvePathToProject from './resolvePathToProject';

export default async function resolveCommandPathToProject(cmd: TDefaultCommand): Promise<string> {
  displayCommandStep(cmd, colors.yellow(`Resolve path to current project...`));
  const pathToProject = resolvePathToProject();
  if (!pathToProject) {
    throw new Error('Unable to resolve path to project: does package.json exist in the project folder?');
  }

  return pathToProject;
}
