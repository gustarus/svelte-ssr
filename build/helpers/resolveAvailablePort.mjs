const detect = require('detect-port');
export default function resolveAvailablePort(port) {
    return new Promise((resolve, reject) => {
        detect(port, (error, available) => {
            if (error) {
                reject(error);
                return;
            }
            resolve({
                requested: parseInt(port.toString(), 10),
                available: parseInt(available, 10),
            });
        });
    });
}
