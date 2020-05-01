import Redirect from '../models/Redirect';

export default function resolveRedirect(status: number, url?: string): Redirect {
  return new Redirect({ status, url });
}
