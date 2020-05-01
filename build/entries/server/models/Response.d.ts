import Component from '../../../base/Component';
export declare namespace ResponseSpace {
    type Config = {
        status?: string | number;
        body?: string;
    };
}
export default class Response extends Component<ResponseSpace.Config> {
    private _status;
    body: string;
    set status(value: string | number);
    get status(): number;
    get defaults(): any;
}
