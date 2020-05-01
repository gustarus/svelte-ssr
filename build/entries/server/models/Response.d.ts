import Component from '../../../base/Component';
export declare namespace ResponseSpace {
    type Config = {
        status?: number;
        body?: string;
    };
}
export default class Response extends Component<ResponseSpace.Config> {
    status: number;
    body: string;
    get defaults(): any;
}
