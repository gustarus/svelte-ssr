import execSyncProgress from './execSyncProgress';
export default function execSyncProgressReturn(...parts) {
    return execSyncProgress(parts, 'return');
}
;
