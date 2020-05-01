import Redirect from '../models/Redirect';
import Response from '../models/Response';
export default function resolveCandidate(candidate: any | Redirect | Response, prepare: (result: any) => {
    [key: string]: any;
}): {
    [key: string]: any;
} | Redirect | Response;
