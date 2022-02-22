import conditionalFields from "./conditionalFields";

const modalSlide = (num) => ({
  name: `modalSlide${num}`,
  title: `Modal Slide ${num}`,
  type: "object",
  fields: [
    {
      name: "slideHeader",
      type: "string",
      title: `Modaloverskrift ${num}`,
    },
    { name: "slideImage", type: "image", title: `Slidebilde ${num}` },
    {
      name: "altText",
      type: "string",
      title: `Alternativ tekst for bilde ${num}`,
    },
    {
      name: "slideDescription",
      type: "blockContent",
      title: `Slidebeskrivelse ${num}`,
    },
  ],
});

export const endringsloggSchema = (name, title) => ({
  name: name,
  title: title,
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
      title: 'Publisert',
      name: 'publisert',
      description: 'Sett denne til publisert når meldingen skal vises i prod. Meldingen vil vises i preprod også før bryteren avhukes',
      type: 'boolean',
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
      inputComponent: conditionalFields,
      fields: [
        {
          name: "numSlides",
          value: "numSlides",
          title: "Antall modal slides",
          type: "number",
          validation: (Rule) => Rule.required().min(0).max(10),
        },
        {
          name:"forcedModal",
          value: "forcedModal",
          title: "Tvungen modal – dette tvinger modalen til å vises uten at brukeren klikker inn på endringsloggen",
          type: "boolean"
        },
        { name: "modalHeader", type: "string", title: "Modaloverskrift" },
        modalSlide(1),
        modalSlide(2),
        modalSlide(3),
        modalSlide(4),
        modalSlide(5),
        modalSlide(6),
        modalSlide(7),
        modalSlide(8),
        modalSlide(9),
        modalSlide(10),
      ],
    },
  ],
});
