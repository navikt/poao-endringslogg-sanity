import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemas} from './schemas/schema'

export default defineConfig({
    name: "endringslogg",
    title: "endringslogg",
    projectId: "li581mqu",
    dataset: "production",
    plugins: [
        deskTool(undefined),
        visionTool(),
    ],
    schema: {
        types: schemas
    },
})
