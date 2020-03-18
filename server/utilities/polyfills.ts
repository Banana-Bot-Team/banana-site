// polyfill for btoa in server-side
if (typeof btoa === 'undefined') {
  global.btoa = (s: string) => Buffer.from(s).toString('base64');
}

// polyfill for atob in server-side
if (typeof atob === 'undefined') {
  global.atob = (s: string) => Buffer.from(s, 'base64').toString('utf8');
}

declare namespace NodeJS {
  export interface Global {
    atob: (s: string) => string;
    btoa: (s: string) => string;
  }
}
