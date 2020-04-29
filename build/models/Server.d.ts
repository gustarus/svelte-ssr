import Component from '../base/Component';
export declare namespace ServerSpace {
    type Config = {
        port: string;
    };
}
export default class Server extends Component<ServerSpace.Config> {
    port: string;
    get defaults(): any;
}
