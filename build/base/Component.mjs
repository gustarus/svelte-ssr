import Model from './Model';
export default class Component extends Model {
    constructor(config) {
        super();
        this.configure(config);
    }
    get defaults() {
        return {};
    }
    configure(custom = {}) {
        // merge configuration with filter by undefined
        const config = this.defaults;
        for (const name in custom) {
            if (typeof custom[name] !== 'undefined') {
                config[name] = custom[name];
            }
        }
        // pass configuration to the instance
        for (const name in config) {
            if (typeof config[name] !== 'undefined') {
                this[name] = config[name];
            }
        }
        return this;
    }
}
;
