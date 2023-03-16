import {GrCircleAlert} from "react-icons/gr"
import {defineType} from "sanity";

export const oversiktAlert = defineType({
    name: 'alert_overiskten',
    title: 'Alert: Oversikten',
    icon: GrCircleAlert,
    type: "document",
    fields: [
        {
            name: "title",
            title: "Alert tittel",
            type: "string",
            validation: (Rule) => Rule.required().min(2).max(200),
        },
        {
            name: "description",
            title: "Beskrivelse",
            type: "blockContent",
            description: "Alert melding",
            validation: (Rule) => Rule.required(),
        },
        {
            name: "alert",
            title: "Type",
            type: 'string',
            description: "Alert type",
            validation: (Rule) => Rule.required(),
            options: {
                list: [
                    {title: 'Success', value: 'success'},
                    {title: 'Info', value: 'info'},
                    {title: 'Warning', value: 'warning'},
                    {title: 'Error', value: 'error'},
                ]
            }
        },
        {
            title: 'I Prod',
            name: 'publisert',
            type: 'boolean',
            initialValue: false
        },
        {
            title: 'I q1',
            name: 'publisert_q1',
            type: 'boolean',
            initialValue: false
        },
        {
            title: "Aktiv Fra",
            name: "fraDato",
            type: "datetime",
        },
        {
            title: "Aktiv til",
            name: "tilDato",
            type: "datetime",
        }
    ]
});

