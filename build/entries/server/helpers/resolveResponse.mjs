import Response from '../models/Response';
export default function resolveResponse(status, body) {
    return new Response({ status, body });
}
