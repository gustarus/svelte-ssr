import Component from './Component';
export declare namespace SourceSpace {
    type Config = {
        path: string;
    };
    type Position = {
        line: number;
        column: number;
    };
}
export default abstract class Source<C> extends Component<SourceSpace.Config & C> {
    private _path;
    private _source?;
    set path(value: string);
    get path(): string;
    get source(): string;
    set source(content: string);
    save(): void;
    reset(): void;
    getPosition(position: number): SourceSpace.Position;
}
