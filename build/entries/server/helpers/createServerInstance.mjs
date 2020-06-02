export default function createServerInstance(server, port, callback) {
    return server.listen(port, callback);
}
