import util from 'util';
import colors from 'colors';
import moment from 'moment';
import Component from '../base/Component';

export namespace LoggerSpace {
  export type Config = {};

  export type Message = any;

  export type Wrapper = (message: string) => string;
}

export default class Logger extends Component<LoggerSpace.Config> {

  private log(level: number = 0, message: LoggerSpace.Message, wrapper: LoggerSpace.Wrapper): void {
    const timestamp = moment().format('HH:mm:ss');
    const space = '  '.repeat(level);
    const wrapped = wrapper(message.toString());
    console.log(`[${timestamp}] ${space}${wrapped}`);
  }

  public trace(message: LoggerSpace.Message, level?: number): void {
    this.log(level, message, (message) => message);
  }

  public info(message: LoggerSpace.Message, level?: number): void {
    this.log(level, message, (message) => colors.blue(message));
  }

  public warning(message: LoggerSpace.Message, level?: number): void {
    this.log(level, message, (message) => colors.yellow(message));
  }

  public success(message: LoggerSpace.Message, level?: number): void {
    this.log(level, message, (message) => colors.green(message));
  }

  public error(message: LoggerSpace.Message, level?: number): void {
    this.log(level, message, (message) => colors.red(message));
  }

  public inspect(data: any): void {
    console.log(util.inspect(data, { depth: 10, colors: true, maxArrayLength: 5 }));
  }
};
