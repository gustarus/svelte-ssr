import Response from '../models/Response';

export default function resolveResponse(status: number, body: string): Response {
  return new Response({ status, body });
}
