import Component from '../../../base/Component';

export namespace ResponseSpace {
  export type Config = {
    status?: number;
    body?: string;
  };
}

export default class Response extends Component<ResponseSpace.Config> {

  public status: number;

  public body: string;

  public get defaults(): any {
    return {
      status: 200,
      body: '',
    };
  }
};
