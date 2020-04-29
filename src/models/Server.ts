import Component from '../base/Component';

export namespace ServerSpace {
  export type Config = {
    port: string;
  };
}

export default class Server extends Component<ServerSpace.Config> {

  public port: string;

  public get defaults(): any {
    return {
      port: '3000',
    };
  }
}
