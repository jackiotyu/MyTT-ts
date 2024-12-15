import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const isProd = process.env.NODE_ENV === 'production';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: !isProd
    },
    {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: !isProd
    },
    {
      file: 'dist/index.min.js',
      format: 'cjs',
      sourcemap: !isProd,
      plugins: [terser()]
    },
    {
      file: 'dist/index.esm.min.js',
      format: 'es',
      sourcemap: !isProd,
      plugins: [terser()]
    }
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist'
    }),
    resolve(),
    commonjs()
  ]
}; 