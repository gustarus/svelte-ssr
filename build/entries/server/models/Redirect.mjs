import Component from '../../../base/Component';
export default class Redirect extends Component {
    get defaults() {
        return {
            status: 302,
        };
    }
}
;
