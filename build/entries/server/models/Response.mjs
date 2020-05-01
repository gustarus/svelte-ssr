import Component from '../../../base/Component';
export default class Response extends Component {
    get defaults() {
        return {
            status: 200,
            body: '',
        };
    }
}
;
