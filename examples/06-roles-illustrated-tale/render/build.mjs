import * as esbuild from '/opt/npm-tools/node_modules/esbuild/lib/main.js';
const R='/home/claude/remotion-src/packages';
const G='/home/claude/.npm-global/lib/node_modules';
await esbuild.build({
  entryPoints:['render/player-entry.tsx'], bundle:true, outfile:'render/dist/bundle.js', format:'iife',
  jsx:'automatic', loader:{'.png':'dataurl'}, define:{'process.env.NODE_ENV':'"production"'}, minify:false, logLevel:'warning',
  alias:{
    'remotion/no-react':R+'/core/src/no-react.ts',
    'remotion':R+'/core/src/index.ts',
    '@remotion/player':R+'/player/src/index.ts',
    '@remotion/transitions/fade':R+'/transitions/src/presentations/fade.tsx',
    '@remotion/transitions/slide':R+'/transitions/src/presentations/slide.tsx',
    '@remotion/transitions/wipe':R+'/transitions/src/presentations/wipe.tsx',
    '@remotion/transitions/clock-wipe':R+'/transitions/src/presentations/clock-wipe.tsx',
    '@remotion/transitions/iris':R+'/transitions/src/presentations/iris.tsx',
    '@remotion/transitions':R+'/transitions/src/index.ts',
    '@remotion/shapes':R+'/shapes/src/index.ts',
    '@remotion/paths':R+'/paths/src/index.ts',
    'react':G+'/react','react-dom':G+'/react-dom',
  },
});
console.log('built');
