import * as esbuild from 'esbuild'
await esbuild.build({ entryPoints: ['entry.tsx'], bundle: true, outdir: 'dist', format: 'esm', jsx: 'automatic', define: { 'process.env.NODE_ENV': '"production"' }, logLevel: 'error', loader: { '.svg': 'dataurl', '.png': 'dataurl', '.woff2': 'dataurl' } })
console.log('built')
