import Component from '../../../base/Component';
import { DEFAULT_REDIRECT_STATUS, DEFAULT_REDIRECT_URL } from '../../../constants';

export namespace RedirectSpace {
  export type Config = {
    status?: number;
    url?: string;
  };
}

export default class Redirect extends Component<RedirectSpace.Config> {

  public status: number;

  public url: string;

  public get defaults(): any {
    return {
      status: DEFAULT_REDIRECT_STATUS,
      url: DEFAULT_REDIRECT_URL
    };
  }
};
