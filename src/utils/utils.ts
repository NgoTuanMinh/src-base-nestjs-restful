/**
 *
 * @param originSrc
 * @param args
 * @returns
 */
export function printString(originSrc: string, args: string[] = []): string {
  if (args && args.length > 0) {
    return originSrc.replace(
      new RegExp('{([^{]+)}', 'g'),
      function (_unused, index) {
        return args[index];
      },
    );
  } else {
    return originSrc;
  }
}

export function dotize(jsonobj: any, prefix?: string) {
  let newobj = {};
  const recurse = (o: any, p: string) => {
    for (const f in o) {
      const pre = p === undefined ? '' : p + '.';
      if (o[f] && typeof o[f] === 'object') {
        newobj = recurse(o[f], pre + f);
      } else {
        newobj[pre + f] = o[f];
      }
    }
    return newobj;
  };
  return recurse(jsonobj, prefix);
}

// Get items that only occur in the left array,
export const onlyInLeftTwoArray = (
  left: any,
  right: any,
  compareFunction: any,
) => {
  return left.filter(
    (leftValue) =>
      !right.some((rightValue) => compareFunction(leftValue, rightValue)),
  );
};
