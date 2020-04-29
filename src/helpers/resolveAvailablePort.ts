const detect = require('detect-port');

export default function resolveAvailablePort(port: string): Promise<{ requested: string; available: string }> {
  return new Promise((resolve, reject) => {
    detect(port, (error: Error, available: string) => {
      if (error) {
        reject(error);
        return;
      }

      resolve({ requested: port, available });
    });
  });
}
