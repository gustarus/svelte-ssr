type TProps = { [key: string]: any };

export default function resolveRenderProperties(location: TProps, result: TProps, custom: TProps): { props: TProps, conflicts: { location: string[]; result: string[] } } {
  const conflictsWithLocation = [];
  const conflictsWithResult = [];

  for (const name in result) {
    if (typeof location[name] !== 'undefined') {
      conflictsWithLocation.push(name);
    }
  }

  for (const name in custom) {
    if (typeof location[name] !== 'undefined') {
      conflictsWithLocation.push(name);
    }

    if (typeof result[name] !== 'undefined') {
      conflictsWithResult.push(name);
    }
  }

  const props = { ...location };

  for (const name in result) {
    if (typeof result[name] !== 'undefined') {
      props[name] = result[name];
    }
  }

  for (const name in custom) {
    if (typeof custom[name] !== 'undefined') {
      props[name] = custom[name];
    }
  }

  return { props, conflicts: { location: conflictsWithLocation, result: conflictsWithResult } };
}
