export default function listenToExit(callback: () => {}): void {
  // attach user callback to the process event emitter
  process.on('cleanup' as any, callback);

  // do app specific cleaning before exiting
  process.on('exit', function () {
    process.emit('cleanup' as any);
  });

  // catch ctrl+c event and exit normally
  process.on('SIGINT', function () {
    console.log('Ctrl-C...');
    process.exit(2);
  });

  //catch uncaught exceptions, trace, then exit normally
  process.on('uncaughtException', function (e) {
    console.log('Uncaught Exception...');
    console.log(e.stack);
    process.exit(99);
  });
};
