import Component from '../../../base/Component';

export namespace ResponseSpace {
  export type Config = {
    status?: string | number;
    body?: string;
  };
}

export default class Response extends Component<ResponseSpace.Config> {

  private _status: number;

  public body: string;

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
      status: 200,
      body: '',
    };
  }
};
