// FILM=notebook|jahiz node build.mjs   (esbuild + react from ESBUILD_MAIN / NODE_GLOBAL, or `npm i esbuild react react-dom`)
const esbuild = ((m) => m.default || m)(await import(process.env.ESBUILD_MAIN || 'esbuild'));
const G = process.env.NODE_GLOBAL || './node_modules', FILM = process.env.FILM || 'notebook';
await esbuild.build({entryPoints: ['entry.tsx'], bundle: true, outdir: 'dist', format: 'esm', jsx: 'automatic',
  define: {'process.env.NODE_ENV': '"production"'}, logLevel: 'error', loader: {'.png': 'dataurl', '.svg': 'dataurl', '.jpg': 'dataurl'},
  alias: {react: G + '/react', 'react-dom': G + '/react-dom', 'lucide-react': './shim/lucide-react.tsx', '@film': `./src/films/${FILM}.tsx`}});
console.log('built', FILM);
