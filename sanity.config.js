import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemas} from './schemas/schema'
import {structure} from "./deskStructures/deskStructure";

export default defineConfig({
    name: "endringslogg",
    title: "endringslogg",
    projectId: "li581mqu",
    dataset: "production",
    plugins: [
        deskTool({structure: structure}),
        visionTool(),
    ],
    schema: {
        types: schemas
    },
})
