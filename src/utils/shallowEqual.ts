/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x: any, y: any) {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    return x !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}

export default function shallowEqual(a: { [key: string]: any } | undefined, b: { [key: string]: any } | undefined) {
  if (b === a) {
    return true;
  }
  if (!a || !b) {
    return false;
  }

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  const len = aKeys.length;

  if (bKeys.length !== len) {
    return false;
  }

  for (var i = 0; i < len; i++) {
    var key = aKeys[i];

    if (!is(a[key], b[key])) {
      return false;
    }
  }

  return true;
}
