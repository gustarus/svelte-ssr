import Component from '../base/Component';
export default class Server extends Component {
    get defaults() {
        return {
            port: '3000',
        };
    }
}
