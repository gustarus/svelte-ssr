import Component from '../../../base/Component';
export declare namespace RedirectSpace {
    type Config = {
        status?: number;
        url?: string;
    };
}
export default class Redirect extends Component<RedirectSpace.Config> {
    status: number;
    url: string;
    get defaults(): any;
}
