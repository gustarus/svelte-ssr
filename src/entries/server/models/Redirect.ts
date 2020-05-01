import Component from '../../../base/Component';
import { DEFAULT_REDIRECT_STATUS, DEFAULT_REDIRECT_URL } from '../../../constants';

export namespace RedirectSpace {
  export type Config = {
    status?: string|number;
    url?: string;
  };
}

export default class Redirect extends Component<RedirectSpace.Config> {

  private _status: number;

  public url: string;

  // @ts-ignore
  public set status(value: string | number) {
    this._status = parseInt(value.toString(), 10);
  }

  // @ts-ignore
  public get status(): number {
    return this._status;
  }

  public get defaults(): any {
    return {
      status: DEFAULT_REDIRECT_STATUS,
      url: DEFAULT_REDIRECT_URL,
    };
  }
};
