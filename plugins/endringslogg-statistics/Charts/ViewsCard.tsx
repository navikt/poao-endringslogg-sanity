import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import {
  Box,
  Card,
  CardHeader,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import { convertFromUTCDate, dateFormatter, dateInLastWeek } from "../utils";
import { UserData } from "../types";

const countSeenSingleId = (userData: any[], id: string) =>
  userData.reduce((acc, val) => (val["documentId"] === id ? ++acc : acc), 0);

const countSeenSingleIdToday = (userData: any[], id: string) =>
  userData.reduce(
    (acc, val) =>
      val["documentId"] === id &&
      dateFormatter(convertFromUTCDate(new Date(val["timeStamp"]))) ==
        dateFormatter(new Date())
        ? ++acc
        : acc,
    0
  );

const countSeenSingleIdLastWeek = (userData: any[], id: string) =>
  userData.reduce(
    (acc, val) =>
      val["documentId"] === id &&
      dateInLastWeek(convertFromUTCDate(new Date(val["timeStamp"])))
        ? ++acc
        : acc,
    0
  );

// Shows breakdown of how many have opened link/modal for a given document
export const ViewsCard = ({
  userData,
  filteredUserData,
  loadingUserData,
  id,
}: {
  userData: UserData[];
  filteredUserData: UserData[];
  loadingUserData: boolean;
  id: string;
}) => {
  return (
    <Box mt={9} height="100%">
      <Card
        elevation={2}
        style={{
          textAlign: "center",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loadingUserData ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </div>
        ) : (
          <Box>
            <Box mb={2}>
              <Typography variant="h3">
                {countSeenSingleIdToday(userData, id)}
              </Typography>
              <Typography variant="h5">Antall visninger i dag</Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="h3">
                {countSeenSingleIdLastWeek(userData, id)}
              </Typography>
              <Typography variant="h5">
                Antall visninger siste 7 dager
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="h3">
                {countSeenSingleId(filteredUserData, id)}
              </Typography>
              <Typography variant="h5">
                Antall visninger i tidsintervall
              </Typography>
            </Box>
            <Box>
              <Typography variant="h3">
                {countSeenSingleId(userData, id)}
              </Typography>
              <Typography variant="h5">Antall visninger totalt</Typography>
            </Box>
          </Box>
        )}
      </Card>
    </Box>
  );
};
