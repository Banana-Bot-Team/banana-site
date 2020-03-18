// polyfill for btoa in server-side
if (typeof btoa === 'undefined') {
  global.btoa = (s) => Buffer.from(s).toString('base64');
}

// polyfill for atob in server-side
if (typeof atob === 'undefined') {
  global.atob = (s) => Buffer.from(s, 'base64').toString('utf8');
}
