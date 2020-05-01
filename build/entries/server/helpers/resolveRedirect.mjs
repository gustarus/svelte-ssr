import Redirect from '../models/Redirect';
export default function resolveRedirect(status, url) {
    return new Redirect({ status, url });
}
