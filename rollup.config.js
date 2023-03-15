import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

export default {
    input: 'src/index.ts',
    output: {
        file: './dist/bundle.js',
        format: "umd",
        sourcemap: true
    },
    plugins: [
        typescript(),
        resolve(),
        commonjs(),
        babel({
            exclude: "node_modules/**"
        })
    ],
    external: [
        "lodash"
    ]
    
}