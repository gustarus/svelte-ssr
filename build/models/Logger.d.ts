import Component from '../base/Component';
export declare namespace LoggerSpace {
    type Config = {};
    type Message = any;
    type Wrapper = (message: string) => string;
}
export default class Logger extends Component<LoggerSpace.Config> {
    private log;
    trace(message: LoggerSpace.Message, level?: number): void;
    info(message: LoggerSpace.Message, level?: number): void;
    warning(message: LoggerSpace.Message, level?: number): void;
    success(message: LoggerSpace.Message, level?: number): void;
    error(message: LoggerSpace.Message, level?: number): void;
    debug(...data: any[]): void;
}
