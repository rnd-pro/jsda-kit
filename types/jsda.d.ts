declare type JSDA_CFG = {
  
  dynamic?: Partial<{
    port: number;
    routes: string;
    cache: Partial<{
      inMemory: boolean;
      exclude: string[];
    }>;
    baseDir: string;
    getRouteFn?: (url: string, headers: import('http').IncomingHttpHeaders) => Promise<string>;
    getDataFn?: (route: string, url: string, headers: import('http').IncomingHttpHeaders) => Promise<{ [key: string]: string }>;
  }>;

  static?: Partial<{
    outputDir: string;
    sourceDir: string;
    port: number;
    /** Glob-style JSDA entry file patterns. Patterns without "/" match filenames in any sourceDir folder. */
    entryPatterns: string[];
    /** Static copy rules. `to` is relative to outputDir. */
    copy: Array<{
      from: string;
      to: string;
    }>;
    /** PDF generation settings used by `jsda build-pdf` and `jsda ssg-pdf`. */
    pdf: Partial<{
      /** Puppeteer page.setContent waitUntil option. */
      waitUntil: string | string[];
      /** Alternate destination for generated PDFs. Empty means outputDir. */
      outputDir: string;
      /** Options passed to puppeteer.launch(). */
      launchOptions: Record<string, unknown>;
      /** Default options passed to page.pdf(), including margin. */
      options: Record<string, unknown>;
    }>;
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

  markdown?: Partial<{
    externalLinks: Partial<{
      /** Add target/rel to absolute HTTP(S) markdown links */
      enabled: boolean;
      /** Link target for external links, e.g. '_blank' */
      target: string;
      /** Link rel for external links, e.g. 'noopener noreferrer' */
      rel: string;
      /** URL substrings to exclude from external-link attributes */
      exclude: string[];
    }>;
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

declare type JSDA_MD2HTML_OPTIONS = Partial<{
  externalLinks: Partial<{
    enabled: boolean;
    target: string;
    rel: string;
    exclude: string[];
  }>;
}>;

declare type cli_commands = {
  ssg: void;
  'ssg-pdf': void;
  serve: void;
  scaffold: void;
  build: void;
  'build-pdf': void;
};
