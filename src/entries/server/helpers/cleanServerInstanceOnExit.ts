import http from 'http';
import listenToExit from './listenToExit';

export default function cleanServerInstanceOnExit(server: http.Server): void {
  listenToExit(() => server.close());
};
