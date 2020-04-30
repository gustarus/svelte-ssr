export default function resolveNormalizedPath(...parts) {
    const cleaned = parts.join('/')
        .replace(/\/\/+/g, '/')
        .replace(/\/$/, '')
        .replace(/^\//, '');
    return `/${cleaned ? `${cleaned}/` : ''}`;
}
