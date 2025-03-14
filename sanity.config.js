import {createAuthStore, defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemas} from './schemas/schema'
import {structure} from "./deskStructures/deskStructure";

export default defineConfig({
    name: "endringslogg",
    title: "Endringslogg",
    projectId: "li581mqu",
    dataset: "production",
    auth: createAuthStore({
        projectId: "li581mqu",
        dataset: "production",
        redirectOnSingle: false,
        mode: "append",
        providers: [
            {
                "name": "saml",
                "title": "NAV SSO",
                "url": "https://api.sanity.io/v2021-10-01/auth/saml/login/f3270b37",
                "logo": "/static/nav-logo-sso.png",
            }
        ],
    }),
    plugins: [
        structureTool({structure: structure}),
        visionTool(),
    ],
    schema: {
        types: schemas
    },
})
