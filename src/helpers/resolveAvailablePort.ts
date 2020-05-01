const detect = require('detect-port');

export default function resolveAvailablePort(port: string | number): Promise<{ requested: number; available: number }> {
  return new Promise((resolve, reject) => {
    detect(port, (error: Error, available: string) => {
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
