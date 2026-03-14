declare type JSDA_CFG = {
  
  dynamic: {
    port: number;
    routes: string;
    cache: {
      inMemory: boolean;
      exclude: string[];
    };
    baseDir: string;
    getRouteFn: (url: string, headers: import('http').IncomingHttpHeaders) => Promise<string>;
    getDataFn: (route: string, url: string, headers: import('http').IncomingHttpHeaders) => Promise<{ [key: string]: string }>;
  };

  static: {
    outputDir: string;
    sourceDir: string;
  };

  minify: {
    js: boolean;
    css: boolean;
    html: boolean;
    svg: boolean;
    exclude: string[];
  };

  bundle: {
    js: boolean;
    css: boolean;
    exclude: string[];
  };

  log: boolean;

  /** Enable SSR pass during SSG build */
  ssr: boolean;

  importmap: {
    packageList: string[];
    srcSchema: string;
    polyfills: boolean;
    preload: boolean;
  };

};

declare type cli_commands = {
  ssg: void;
  serve: void;
  init: void;
  build: void;
};