import { transform } from '@babel/standalone'

const EnvPreset = require('@babel/preset-env')
const ReactPreset = require('@babel/preset-react')
const TypescriptPreset = require('@babel/preset-typescript')

export const compileComponent = (code: string) : string | undefined => {
    console.time("Compiling...")
    try{
        const result = transform(code, {
            ast: true,
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
    }
}