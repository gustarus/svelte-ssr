import Redirect from '../models/Redirect';
import Response from '../models/Response';
export default function resolveCandidate(candidate, prepare) {
    if (candidate instanceof Redirect) {
        return candidate;
    }
    if (candidate instanceof Response) {
        return candidate;
    }
    return prepare ? prepare(candidate) : candidate;
}
