import listenToExit from './listenToExit';
export default function cleanServerInstanceOnExit(server) {
    listenToExit(() => server.close());
}
;
