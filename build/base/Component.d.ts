import Model from './Model';
export default class Component<C> extends Model {
    config: C;
    constructor(config: C);
    get defaults(): Partial<C>;
    protected configure(custom?: {
        [key: string]: any;
    }): this;
}
