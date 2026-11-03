// esbuild + react resolved from env (or a normal `npm i esbuild react react-dom`): ESBUILD_MAIN, NODE_GLOBAL
const esbuild = ((m) => m.default || m)(await import(process.env.ESBUILD_MAIN || 'esbuild'));
const G = process.env.NODE_GLOBAL || './node_modules';
await esbuild.build({entryPoints:['entry.tsx'],bundle:true,outdir:'dist',format:'esm',jsx:'automatic',splitting:false,
  define:{'process.env.NODE_ENV':'"production"'},logLevel:'error',loader:{'.png':'dataurl','.svg':'dataurl','.jpg':'dataurl'},
  alias:{react:G+'/react','react-dom':G+'/react-dom','lucide-react':'./shim/lucide-react.tsx'}});
console.log('built');
