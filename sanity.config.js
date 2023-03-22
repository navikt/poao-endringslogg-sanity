import {buildLegacyTheme, createAuthStore, defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemas} from './schemas/schema'
import {structure} from "./deskStructures/deskStructure";
import NavLogo from "./components/navLogo"

const NAVTheme = buildLegacyTheme({
    /* Brand colors */
    '--brand-primary': '#0067c5',
    '--brand-primary--inverted': '#ffffff',
    '--brand-secondary': '#cce1ff',
    '--brand-secondary--inverted': '#002252',
    /* Typography */
    '--font-size-base': '1.5rem',
    /* Main Navigation */
    '--main-navigation-color': '#595959',
    '--main-navigation-color--inverted': '#ffffff'
})

export default defineConfig({
    name: "endringslogg",
    title: "endringslogg",
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
        deskTool({structure: structure}),
        visionTool(),
    ],
    schema: {
        types: schemas
    },
    studio: {
        components: {
            logo: NavLogo,
        }
    },
    theme: NAVTheme
})
