import {MdNotificationsActive} from "react-icons/md";
import {modalSlide} from "./modalSlide";
import {defineType} from "sanity";

export const mrAdminflateEndringsloggSchema = defineType({
    name: "endringslogg_mr-adminflate",
    title: "Endringslogg: MR Adminflate",
    icon: MdNotificationsActive,
    type: "document",
    fields: [
        {
            name: "title",
            title: "Tittel på endring",
            type: "string",
            validation: (Rule) => Rule.required().min(2).max(200),
        },
        {
            name: "description",
            title: "Beskrivelse",
            type: "blockContent",
            description:
                "Kort forklaring av hvilke endringer som er gjort, og hvordan disse påvirker brukeren.",
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'publisert',
            description: 'Sett denne til publisert når meldingen skal vises i prod. Meldingen vil vises i preprod også før bryteren avhukes',
            type: 'boolean',
            initialValue: false,
        },
        {
            title: "Release date",
            name: "date",
            type: "date",
            validation: (Rule) => Rule.required(),
        },
        {
            name: "linkAttributes",
            title: "Lenke til mer informasjon",
            type: "object",
            fields: [
                {
                    name: "linkText",
                    title: "Lenketekst",
                    type: "string",
                },
                {
                    name: "link",
                    title: "Lenke",
                    type: "url",
                },
            ],
        },
        {
            title: "Se hvordan-modal",
            name: "modal",
            type: "object",
            fields: [
                {
                    name: "numSlides",
                    value: "numSlides",
                    title: "Antall modal slides",
                    type: "number",
                    initialValue: 0,
                    validation: (Rule) => Rule.required().min(0).max(10),
                },
                {
                    name: "forcedModal",
                    value: "forcedModal",
                    title: "Tvungen modal – dette tvinger modalen til å vises uten at brukeren klikker inn på endringsloggen",
                    type: "boolean",
                    hidden: ({parent}) => parent?.numSlides === undefined || parent?.numSlides <= 0
                },
                {
                    name: "modalHeader",
                    type: "string",
                    title: "Modaloverskrift",
                    hidden: ({parent}) => parent?.numSlides === undefined || parent?.numSlides <= 0
                },
                modalSlide(1),
                modalSlide(2),
                modalSlide(3),
                modalSlide(4),
                modalSlide(5),
            ],
        },
    ],
    defaultOrdering: {field: 'date', direction: 'desc'},
    orderings: [
        {
            title: 'Lanseringsdato',
            name: 'releaseDateDesc',
            by: [
                {field: 'date', direction: 'desc'}
            ]
        }
    ]
});
