import Component from '../../../base/Component';

export namespace RedirectSpace {
  export type Config = {
    status?: number;
    url: string;
  };
}

export default class Redirect extends Component<RedirectSpace.Config> {

  public status: number;

  public url: string;

  public get defaults(): any {
    return {
      status: 302,
    };
  }
};
