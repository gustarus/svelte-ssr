import path from 'path';
import Component from './Component';
import fs from 'fs';
export default class Source extends Component {
    set path(value) {
        this._path = path.resolve(value);
    }
    get path() {
        return this._path;
    }
    get source() {
        if (!this._source) {
            this._source = fs.readFileSync(this.path).toString();
        }
        return this._source;
    }
    set source(content) {
        this._source = content;
        this.save();
    }
    save() {
        fs.writeFileSync(this.path, this.source);
        this.reset();
    }
    reset() {
        delete this._source;
    }
    getPosition(position) {
        const part = this.source.substr(0, position);
        const lines = part.split('\n');
        const line = lines.length;
        const column = lines[lines.length - 1].length;
        return { line, column };
    }
}
