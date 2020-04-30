import colors from 'colors/safe';
import moment from 'moment';
export default function displayCommandStep(cmd, message) {
    const timestamp = moment().format('HH:mm:ss');
    console.log(`[${timestamp}] [${colors.blue(cmd.name())}] ${message}`);
}
;
