const detect = require('detect-port');
export default function resolveAvailablePort(port) {
    return new Promise((resolve, reject) => {
        detect(port, (error, available) => {
            if (error) {
                reject(error);
                return;
            }
            resolve({ requested: port, available });
        });
    });
}
