import React, { useEffect, useState } from "react";
//@ts-ignore
import { Endringslogg } from "endringslogg";
// https://github.com/sanity-io/sanity/issues/456
import "endringslogg/dist/bundle.css?raw";
import client from "part:@sanity/base/client";
import schema from "part:@sanity/base/schema";
import "@navikt/ds-css?raw";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Grid,
  Typography,
  Card,
  Box,
  makeStyles,
} from "@material-ui/core";

const backendUrl = "https://familie-endringslogg.dev.intern.nav.no";

type App = {
  name: string;
  _type: string;
};

type SanityDocument = {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
  date: string;
  description?: any[];
  modal: Object;
  title: string;
  appName: string;
};

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 240,
    width: "95vw",
  },
  select: {
    backgroundColor: "white",
  },
}));

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
  const classes = useStyles();
  const [app, setApp] = useState<App>({ name: "", _type: "" });

  const [documents, setDocuments] = useState<SanityDocument[]>([]);

  useEffect(() => {
    client
      .fetch(
        '*[!(_id in path("drafts.**")) && _type in $types] | order (_type desc)',
        { types: getDocumentTypeNames() }
      )
      .then((resp: any) =>
        setDocuments(
          resp.map((entry: any) => ({
            ...entry,
            appName: schema.get(entry["_type"]).title,
          }))
        )
      );
  }, []);

  const handleAppChange = (event: any) => {
    setApp(event.target.value);
  };

  // Remove focus from menu when an app has been selected
  const handleExitMenu = (node: HTMLElement) => {
    //@ts-ignore
    document.activeElement.blur();
  };

  return (
    <Box>
      <FormControl variant="filled" className={classes.formControl}>
        <InputLabel id="select-label">
          <Typography>Applikasjon</Typography>
        </InputLabel>
        <Select
          id="select"
          value={app}
          onChange={handleAppChange}
          className={classes.select}
          MenuProps={{
            onExited: handleExitMenu,
          }}
        >
          {documents
            .reduce((acc, doc) => {
              if (!acc.map((a) => a.name).includes(doc.appName))
                acc.push({
                  name: doc.appName,
                  _type: doc._type,
                });
              return acc;
            }, [] as App[])
            .map((doc, idx) => (
              //@ts-ignore
              <MenuItem key={idx} value={doc}>
                <Typography>{doc.name}</Typography>
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      {app._type && (
        <Endringslogg
          userId={"1"}
          appId={app._type}
          appName={app.name}
          dataset={"production"}
          backendUrl={backendUrl}
        />
      )}
    </Box>
  );
};
