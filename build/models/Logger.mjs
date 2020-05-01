import util from 'util';
import colors from 'colors';
import moment from 'moment';
import Component from '../base/Component';
export default class Logger extends Component {
    log(level = 0, message, wrapper) {
        const timestamp = moment().format('HH:mm:ss');
        const space = '  '.repeat(level);
        const wrapped = wrapper(message.toString());
        console.log(`[${timestamp}] ${space}${wrapped}`);
    }
    trace(message, level) {
        this.log(level, message, (message) => message);
    }
    info(message, level) {
        this.log(level, message, (message) => colors.blue(message));
    }
    warning(message, level) {
        this.log(level, message, (message) => colors.yellow(message));
    }
    success(message, level) {
        this.log(level, message, (message) => colors.green(message));
    }
    error(message, level) {
        this.log(level, message, (message) => colors.red(message));
    }
    inspect(data) {
        console.log(util.inspect(data, { depth: 10, colors: true, maxArrayLength: 5 }));
    }
}
;
