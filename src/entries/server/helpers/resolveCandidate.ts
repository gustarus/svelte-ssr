import Redirect from '../models/Redirect';
import Response from '../models/Response';

export default function resolveCandidate(candidate: any | Redirect | Response, prepare: (result: any) => { [key: string]: any }): { [key: string]: any } | Redirect | Response {
  if (candidate instanceof Redirect) {
    return candidate;
  }

  if (candidate instanceof Response) {
    return candidate;
  }

  return prepare ? prepare(candidate) : candidate;
}
