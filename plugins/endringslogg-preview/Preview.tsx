import React, {useEffect, useState} from "react";
//@ts-ignore
import { Endringslogg } from "endringslogg";
// https://github.com/sanity-io/sanity/issues/456
import "endringslogg/dist/bundle.css?raw";
import client from "part:@sanity/base/client";
import schema from "part:@sanity/base/schema";
import "@navikt/ds-css?raw";
import {Box} from "@material-ui/core";
import {BlockContentType} from "@navikt/familie-endringslogg/dist/utils/endringslogg-custom";

export declare type ModalType = {
  modalHeader?: string;
  slides: Step[];
};
declare type Step = {
  slideHeader: string;
  slideDescription?: BlockContentType;
  altText?: string;
  slideImage?: any;
};
declare type LinkAttributes = {
  link: string;
  linkText: string;
};
type SanityDocument = {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
  date: string;
  description?: any[];
  modal?: ModalType;
  title: string;
  appName: string;
  linkAttributes?: LinkAttributes
};

function getDocumentTypeNames() {
  return schema
    .getTypeNames()
    .map((typeName: any) => schema.get(typeName))
    .filter(
      (type: any) =>
        type.type &&
        type.type.name === "document" &&
        type.name != "sanity.imageAsset"
    )
    .map((type: any) => type.name);
}

export const EndringsloggPreview = () => {
  const [documents, setDocuments] = useState<SanityDocument[]>([]);

  useEffect(() => {
    client
      .fetch(
        '*[_type in $types] | order (date desc)',
        { types: getDocumentTypeNames() }
      )
      .then((resp: any) =>
        setDocuments(
          resp.map((entry: any) => ({
            ...entry,
            appName: "afolg",
          }))
        )
      );
  }, []);
  // @ts-ignore
  const endringsloggEntryWithSeenStatus: EndringsloggEntryWithSeenStatus[] = documents.map( function (doc, i){
    return {title: doc.title, _id: doc._id, date:doc.date, modal: {modalHeader: doc.modal?.modalHeader},  description: doc.description,
      forced: false, seen: false, seenForced: false,linkAttributes: doc.linkAttributes, link: doc.linkAttributes?.link, linkText: doc.linkAttributes?.linkText }
  })
  return (
    <Box>
      {endringsloggEntryWithSeenStatus.length > 0 &&
        <Endringslogg
            userId={"1"}
            appId="afolg"
            appName="Arbeidsrettet oppfølging"
            dataset={"test"}
            backendUrl="http://poao-endringslogg.dev.intern.nav.no"
            localData = {endringsloggEntryWithSeenStatus}
        />
      }
    </Box>
  );
};
