export default function resolveLocationNormalizedPath(path) {
    const cleaned = path
        .replace(/\/\/+/g, '/')
        .replace(/\/$/, '')
        .replace(/^\//, '');
    return `/${cleaned ? `${cleaned}/` : ''}`;
}
