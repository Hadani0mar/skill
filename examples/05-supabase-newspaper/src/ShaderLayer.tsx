// Frame-driven WebGL2 full-screen shader for Remotion: React Bits backgrounds ported by
// copying their fragment shader and feeding uTime from the current frame (no requestAnimationFrame).
import React, {useEffect, useRef} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

type U = Record<string, number | number[]>;
const VERT = `#version 300 es
in vec2 aPosition; void main(){ gl_Position = vec4(aPosition,0.0,1.0); }`;

export const ShaderLayer: React.FC<{frag: string; uniforms: (t: number, w: number, h: number) => U; style?: React.CSSProperties}> = ({frag, uniforms, style}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<{gl: WebGL2RenderingContext; prog: WebGLProgram; loc: Record<string, WebGLUniformLocation | null>} | null>(null);
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  useEffect(() => {
    const c = ref.current!;
    const gl = c.getContext('webgl2', {preserveDrawingBuffer: true, premultipliedAlpha: true, alpha: true})!;
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, frag));
    gl.bindAttribLocation(prog, 0, 'aPosition');
    gl.linkProgram(prog);
    const buf = gl.createBuffer();
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const loc: Record<string, WebGLUniformLocation | null> = {};
    const n = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) {
      const info = gl.getActiveUniform(prog, i)!;
      loc[info.name.replace(/\[0\]$/, '')] = gl.getUniformLocation(prog, info.name);
    }
    glRef.current = {gl, prog, loc};
  }, [frag]);
  useEffect(() => {
    const g = glRef.current;
    if (!g) return;
    const {gl, prog, loc} = g;
    const c = ref.current!;
    gl.viewport(0, 0, c.width, c.height);
    gl.useProgram(prog);
    const u = uniforms(frame / fps, c.width, c.height);
    for (const [k, v] of Object.entries(u)) {
      const l = loc[k];
      if (l == null) continue;
      if (typeof v === 'number') gl.uniform1f(l, v);
      else if (v.length === 2) gl.uniform2fv(l, v);
      else if (v.length === 3) gl.uniform3fv(l, v);
      else if (v.length === 4) gl.uniform4fv(l, v);
      else gl.uniform4fv(l, v);
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  });
  return (
    <AbsoluteFill style={style}>
      <canvas ref={ref} width={width} height={height} style={{width: '100%', height: '100%'}} />
    </AbsoluteFill>
  );
};
