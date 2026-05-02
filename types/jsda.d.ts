declare type JSDA_CFG = {
  
  dynamic?: Partial<{
    port: number;
    routes: string;
    cache: Partial<{
      inMemory: boolean;
      exclude: string[];
    }>;
    baseDir: string;
    getRouteFn: (url: string, headers: import('http').IncomingHttpHeaders) => Promise<string>;
    getDataFn: (route: string, url: string, headers: import('http').IncomingHttpHeaders) => Promise<{ [key: string]: string }>;
  }>;

  static?: Partial<{
    outputDir: string;
    sourceDir: string;
    port: number;
  }>;

  minify?: Partial<{
    js: boolean;
    css: boolean;
    html: boolean;
    svg: boolean;
    exclude: string[];
  }>;

  bundle?: Partial<{
    js: boolean;
    css: boolean;
    exclude: string[];
  }>;

  log?: boolean;

  /** SSR configuration — `true` enables with defaults, or pass object for full control */
  ssr?: boolean | {
    enabled?: boolean;
    imports?: string[];
    /** CSP nonce string added to all inline style tags during SSR */
    cspNonce?: string;
  };

  importmap?: Partial<{
    packageList: string[];
    srcSchema: string;
    polyfills: boolean;
    preload: boolean;
  }>;

  /** Sitemap generation — `true` enables with defaults, or pass object for full control */
  sitemap?: boolean | Partial<{
    enabled: boolean;
    /** Required when enabled, e.g. 'https://example.com' */
    baseUrl: string;
    /** URL path substrings to exclude from sitemap */
    exclude: string[];
    /** Default changefreq for all entries */
    changefreq: string;
    /** Default priority for all entries */
    priority: string;
    /** Output filename (default: 'sitemap.xml') */
    filename: string;
  }>;

};

declare type cli_commands = {
  ssg: void;
  serve: void;
  scaffold: void;
  build: void;
};