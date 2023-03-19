import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import path from 'path'

const pathResolve = (...args) => path.resolve(...args)

export default {
    input: 'src/index.ts',
    output: {
        file: pathResolve('./dist', "bundle.js"),
        name: "dist",
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