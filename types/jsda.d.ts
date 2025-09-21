declare type JSDA_CFG = {
  
  dynamic: {
    port: number; // 3000 is default
    routes: string; // *.js file with the mapping object default export 
    cache: {
      inMemory: boolean;
      exclude: string[];
    };
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

  importmap: {
    packageList: string[];
    srcSchema: string; // Example: https://cdn.jsdelivr.net/npm/{pkg-name}/+esm
    polyfills: boolean;
    preload: boolean;
  };

};