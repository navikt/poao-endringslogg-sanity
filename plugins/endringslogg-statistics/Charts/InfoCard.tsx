import React, { useEffect, useState } from "react";
import client from "part:@sanity/base/client";
import {
  Box,
  Card,
  CircularProgress,
  Link,
  Typography,
} from "@material-ui/core";
import { Author, History, SanityDocument } from "../types";
import { formatISO9075 } from "date-fns";

// Display various info about the document
export const InfoCard = ({
  document,
  appId,
}: {
  document: SanityDocument;
  appId: string;
}) => {
  const [history, setHistory] = useState<History[] | undefined>();
  const [lastEditor, setLastEditor] = useState<Author | undefined>();
  const [loadingLastEditor, setLoadingLastEditor] = useState<boolean>(false);
  useEffect(() => {
    setLoadingLastEditor(true);
    client
      .request({
        uri: `/data/history/${client.config().dataset}/transactions/${
          document?._id
        }?excludeContent=true`,
      })
      .then((resp: string) => {
        setHistory(
          resp
            .split("\n")
            .slice(0, -1)
            .map((h) => JSON.parse(h))
        );
      });
  }, [document]);

  useEffect(() => {
    if (history && history.length > 0) {
      client
        .request({
          uri: `/projects/${client.config().projectId}/users/${
            history?.[history.length - 1]?.author
          }`,
        })
        .then((resp: any) => {
          setLastEditor(resp);
          setLoadingLastEditor(false);
        });
    } else {
      setLastEditor(undefined);
      setLoadingLastEditor(false);
    }
  }, [history]);

  return (
    <Box height="100%" mt={9}>
      <Card
        elevation={2}
        style={{
          width: "100%",
          height: "100%",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {document && (
          <Box>
            <Link
              href={`/${client.config().dataset}/desk/${appId};${document._id}`}
            >
              <Typography variant="h4">{document.title}</Typography>
            </Link>

            {history && (
              <Box pt={4}>
                <Box
                  display="inline-block"
                  px={3}
                  style={{
                    verticalAlign: "top",
                    textAlign: "left",
                    lineHeight: "1rem",
                  }}
                >
                  <Typography color="textSecondary">
                    Første publiseringsdato
                  </Typography>
                  <Box pb={4}>
                    <Typography variant="h5">
                      {formatISO9075(new Date(document._createdAt))}
                    </Typography>
                  </Box>
                  <Typography color="textSecondary">Har Lenke</Typography>
                  <Box pb={3}>
                    <Typography variant="h5">
                      {document.linkAttributes ? "Ja" : "Nei"}
                    </Typography>

                  </Box>
                  <Typography color="textSecondary">Har Modal</Typography>
                  <Typography variant="h5">
                    {document.modal ? "Ja" : "Nei"}
                  </Typography>
                </Box>
                {loadingLastEditor ? (
                  <CircularProgress />
                ) : (
                  lastEditor && (
                    <Box
                      display="inline-block"
                      px={3}
                      style={{ verticalAlign: "top", textAlign: "left" }}
                    >
                      <Typography color="textSecondary">
                        Siste endring publisert av
                      </Typography>
                      <Typography variant="h5">
                        {lastEditor.displayName || "Unknown"}
                      </Typography>
                      <img src={lastEditor.imageUrl} width={100} height={100} />
                      <Box pt={1}>
                        <Typography color="textSecondary">
                          Endring publisert
                        </Typography>
                        <Typography variant="h6">
                          {formatISO9075(
                            new Date(history![history.length - 1]!.timestamp)
                          )}
                        </Typography>

                      </Box>
                    </Box>
                  )
                )}
              </Box>
            )}
          </Box>
        )}
      </Card>
    </Box>
  );
};
