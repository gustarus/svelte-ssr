import Component from '../base/Component';
import Command from './Command';
import { TBundler } from '../types/TBundler';
export declare namespace ServerSpace {
    type Config = {
        bundler: TBundler;
        port: string;
        base: string;
        live: boolean;
        pathToProject: string;
    };
}
export default class Server extends Component<ServerSpace.Config> {
    bundler: TBundler;
    port: string;
    base: string;
    live: boolean;
    pathToProject: string;
    get defaults(): any;
    get commandStart(): Command;
}
