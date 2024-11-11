export function getMonacoLanguage(filename: string) {
  const extension = filename.split('.')?.pop()?.toLowerCase();

  const languageMap = {
    js: 'javascript',
    ts: 'typescript',
    jsx: 'javascript',
    tsx: 'typescript',
    py: 'python',
    rb: 'ruby',
    php: 'php',
    html: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'scss',
    less: 'less',
    json: 'json',
    xml: 'xml',
    md: 'markdown',
    yaml: 'yaml',
    yml: 'yaml',
    sh: 'shell',
    bash: 'shell',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    cs: 'csharp',
    go: 'go',
    rs: 'rust',
    swift: 'swift',
    kt: 'kotlin',
    sql: 'sql',
    pl: 'perl',
    r: 'r',
    vb: 'vb',
    lua: 'lua',
    dart: 'dart',
    handlebars: 'handlebars',
    hbs: 'handlebars',
    ini: 'ini',
    toml: 'toml',
    txt: 'plaintext',
    // Add more as needed
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return languageMap[extension] ?? 'plaintext';
}
