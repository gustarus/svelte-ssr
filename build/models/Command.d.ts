import Component from '../base/Component';
import Formatter from '../models/Formatter';
export declare namespace CommandSpace {
    type Config = {
        formatter: Formatter;
        parts: Part[];
    };
    type Runtime = {
        wrap?: boolean;
    };
    type Part = Command | string | number | boolean | undefined | {
        [key: string]: Part;
    };
}
export default class Command<C = {}> extends Component<C & CommandSpace.Config> {
    formatter: Formatter;
    parts: CommandSpace.Part[];
    merge(...parts: CommandSpace.Part[]): this;
    compile(runtimeConfig?: CommandSpace.Runtime): string;
    protected compileOptions(options: {
        [key: string]: string | string[];
    }): string;
    protected compileOption(key: string, value: string | boolean | number): string;
    protected wrapCompiled(compiled: string): string;
}
