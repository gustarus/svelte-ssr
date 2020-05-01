import Component from '../../../base/Component';
export default class Response extends Component {
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
            status: 200,
            body: '',
        };
    }
}
;
