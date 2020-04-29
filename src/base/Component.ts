import Model from './Model';

export default class Component<C> extends Model {

  public config: C;

  public constructor(config: C) {
    super();
    this.configure(config);
  }

  public get defaults(): Partial<C> {
    return {} as any;
  }

  protected configure(custom: { [key: string]: any } = {}): this {
    // merge configuration with filter by undefined
    const config: C = this.defaults as C;
    for (const name in custom) {
      if (typeof custom[name] !== 'undefined') {
        (config as any)[name] = custom[name];
      }
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
