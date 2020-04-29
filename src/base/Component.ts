import Model from './Model';

export default class Component<C> extends Model {

  public config: C;

  public constructor(config: C) {
    super();
    this.configure(config);
  }

  public get defaults(): C {
    return {} as C;
  }

  protected configure(custom: { [key: string]: any } = {}): this {
    // merge configuration with filter by undefined
    const config: C = this.defaults;
    for (const name in custom) {
      (config as any)[name] = typeof custom[name] !== 'undefined'
        ? custom[name] : (config as any)[name];
    }

    // pass configuration to the instance
    for (const name in config) {
      if (typeof config[name] !== 'undefined') {
        (this as any)[name] = config[name];
      }
    }

    return this;
  }
};
