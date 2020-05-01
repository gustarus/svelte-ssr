import Component from '../../../base/Component';
import { DEFAULT_REDIRECT_STATUS, DEFAULT_REDIRECT_URL } from '../../../constants';
export default class Redirect extends Component {
    // @ts-ignore
    set status(value) {
        this._status = parseInt(value.toString(), 10);
    }
    // @ts-ignore
    get status() {
        return this._status;
    }
    get defaults() {
        return {
            status: DEFAULT_REDIRECT_STATUS,
            url: DEFAULT_REDIRECT_URL,
        };
    }
}
;
