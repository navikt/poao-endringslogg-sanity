import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { Box, CircularProgress } from "@material-ui/core";
import { useStyles } from "../StatsPanel";

const formatPieData = (seenList: any[]) => {
  const countedData = seenList.reduce(
    (acc, entry) => ({
      ...acc,
      ...(entry?.openedLink ? { openedLink: ++acc.openedLink } : {}),
      ...(entry?.openedModal ? { openedModal: ++acc.openedModal } : {}),
      ...(entry?.openedModal && entry?.openedLink
        ? { openedBoth: ++acc.openedBoth }
        : {}),
    }),
    { openedLink: 0, openedModal: 0, openedBoth: 0 }
  );

  const formattedData = [
    {
      id: "Sett",
      value:
        seenList.length -
        (countedData.openedLink +
          countedData.openedModal -
          countedData.openedBoth),
      color: "#005799",
    },
    {
      id: "Klikket Link",
      value: countedData.openedLink,
      color: "#005799",
    },
    {
      id: "Åpnet Modal",
      value: countedData.openedModal,
      color: "#eeee66",
    },
    {
      id: "Link og Modal",
      value: countedData.openedBoth,
      color: "#72ba5d",
    },
  ];
  return formattedData;
};

// Shows breakdown of how many have opened link/modal for a given document
export const DocumentPie = ({
  data,
  loadingUserData,
  id,
}: {
  data: any[];
  loadingUserData: boolean;
  id: string;
}) => {
  const classes = useStyles();
  return (
    <Box width="100%" mt={9}>
      <Box
        className={classes.documentPie}
        height="29rem"
        maxWidth="35rem"
        mx={4}
      >
        <h1 style={{ textAlign: "center" }}>Antall klikk i komponenten</h1>
        {loadingUserData ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </div>
        ) : (
          <ResponsivePie
            data={formatPieData(data)}
            colors={{ scheme: "paired" }}
            legends={[
              {
                anchor: "bottom",
                direction: "row",
                justify: false,
                translateX: 0,
                translateY: 56,
                itemsSpacing: 0,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: "#999",
                itemDirection: "left-to-right",
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: "circle",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#000",
                    },
                  },
                ],
              },
            ]}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
          />
        )}
      </Box>
    </Box>
  );
};
