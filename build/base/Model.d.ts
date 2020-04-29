export default abstract class Model {
    static create(config: {
        [key: string]: any;
    }): Model;
}
