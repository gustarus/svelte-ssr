import colors from 'colors/safe';
import displayCommandStep from './displayCommandStep';
export default function displayCommandDone(cmd) {
    displayCommandStep(cmd, colors.green('The task was successful'));
}
;
