import fs from 'fs';
import Source from '../base/Source';
export default class Package extends Source {
    get data() {
        const content = fs.readFileSync(this.path).toString();
        return JSON.parse(content);
    }
    get name() {
        return this.data.name;
    }
    get version() {
        return this.data.version;
    }
    get cli() {
        return this.data.bin[this.name];
    }
}
