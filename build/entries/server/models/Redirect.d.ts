import Component from '../../../base/Component';
export declare namespace RedirectSpace {
    type Config = {
        status?: string | number;
        url?: string;
    };
}
export default class Redirect extends Component<RedirectSpace.Config> {
    private _status;
    url: string;
    set status(value: string | number);
    get status(): number;
    get defaults(): any;
}
