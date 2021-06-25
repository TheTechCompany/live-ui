import { transform } from '@babel/standalone'

const EnvPreset = require('@babel/preset-env')
const ReactPreset = require('@babel/preset-react')
const TypescriptPreset = require('@babel/preset-typescript')

export const compileComponent = (code: string) : string | undefined => {
    console.time("Compiling..s.")
    try{
        const result = transform(code, {
            filename: 'component.tsx',
            presets: [
                [EnvPreset, {
                    modules: 'cjs'
                }],
                ReactPreset,
                TypescriptPreset
            ]
        })
        console.timeEnd("Compiling...")
        return result.code?.toString();
    }catch(e){
        console.error("Error compiling code", e)
    }
}