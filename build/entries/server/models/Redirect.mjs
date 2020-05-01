import Component from '../../../base/Component';
import { DEFAULT_REDIRECT_STATUS, DEFAULT_REDIRECT_URL } from '../../../constants';
export default class Redirect extends Component {
    get defaults() {
        return {
            status: DEFAULT_REDIRECT_STATUS,
            url: DEFAULT_REDIRECT_URL
        };
    }
}
;
