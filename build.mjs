import { build } from 'esbuild'

////////////////////////////////////////////////////////////////

const flags = new Set(process.argv.filter((arg) => arg.startsWith('--')))

// https://esbuild.github.io/api/
const options = {
  /* Build Options */
  bundle: true,
  format: 'cjs',
  target: 'es2018',
  platform: 'node',
  watch: flags.has('--watch'),
  minify: flags.has('--minify'),

  /* Misc */
  outfile: './dist/main.js',
  entryPoints: ['./src/main.ts'],
  color: true,
  logLevel: 'warning',
  legalComments: 'eof',
}

build(options).catch(() => process.exit(1))
