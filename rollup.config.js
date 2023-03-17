import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

export default {
    input: 'src/index.ts',
    output: {
        file: 'bundle.js',
        name: "./dist",
        format: "iife",
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