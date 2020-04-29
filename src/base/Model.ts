export default abstract class Model {

  public static create(config: { [key: string]: any }): Model {
    throw new ReferenceError('Not implemented yet');
  };
};
