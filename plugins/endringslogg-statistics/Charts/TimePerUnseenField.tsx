import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { UserSessionData } from "../types";
import { UserSessionDurationStatistics } from "../types";
import { CircularProgress } from "@material-ui/core";

/*
Tid per opened session
*/
const formatUnseenFieldData = (userSessionData: UserSessionData[]) => {
  const acc = {
    "0 uleste mld": 0,
    "1 uleste mld": 0,
    "2 uleste mld": 0,
    "3 uleste mld": 0,
    "4 uleste mld": 0,
    "5+ uleste mld": 0,
  };
  let data: UserSessionDurationStatistics[] = [
    {
      tidsintervall: "0-5 sek",
      ...acc,
    },
    {
      tidsintervall: "5-10 sek",
      ...acc,
    },
    {
      tidsintervall: "10-30 sek",
      ...acc,
    },
    {
      tidsintervall: "30-60 sek",
      ...acc,
    },
    {
      tidsintervall: "60-120 sek",
      ...acc,
    },
    {
      tidsintervall: "120+ sek",
      ...acc,
    },
  ];

  userSessionData.map((userSession) => {
    if (userSession.duration < 5000) {
      if (userSession.unseenFields < 5) {
        //@ts-ignore
        data[0][userSession.unseenFields.toString() + " uleste mld"]++;
      } else {
        data[0]["5+ uleste mld"]++;
      }
    } else if (userSession.duration < 10000) {
      if (userSession.unseenFields < 5) {
        //@ts-ignore
        data[1][userSession.unseenFields.toString() + " uleste mld"]++;
      } else {
        data[1]["5+ uleste mld"]++;
      }
    } else if (userSession.duration < 30000) {
      if (userSession.unseenFields < 5) {
        //@ts-ignore
        data[2][userSession.unseenFields.toString() + " uleste mld"]++;
      } else {
        data[2]["5+ uleste mld"]++;
      }
    } else if (userSession.duration < 60000) {
      if (userSession.unseenFields < 5) {
        //@ts-ignore
        data[3][userSession.unseenFields.toString() + " uleste mld"]++;
      } else {
        data[3]["5+ uleste mld"]++;
      }
    } else if (userSession.duration < 120000) {
      if (userSession.unseenFields < 5) {
        //@ts-ignore
        data[4][userSession.unseenFields.toString() + " uleste mld"]++;
      } else {
        data[4]["5+ uleste mld"]++;
      }
    } else {
      if (userSession.unseenFields < 5) {
        //@ts-ignore
        data[5][userSession.unseenFields.toString() + " uleste mld"]++;
      } else {
        data[5]["5+ uleste mld"]++;
      }
    }
  });

  return data;
};

export const TimePerUnseenField = ({
  data,
  loadingUserSessionData,
}: {
  data: UserSessionData[];
  loadingUserSessionData: boolean;
}) => {
  return (
    <div style={{ height: "30rem" }}>
      <h1 style={{ textAlign: "center" }}>
        {" "}
        Gjennomsnittlig sesjonstid per uleste melding
      </h1>
      {loadingUserSessionData ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </div>
      ) : (
        <ResponsiveBar
          data={formatUnseenFieldData(data)}
          keys={[
            "0 uleste mld",
            "1 uleste mld",
            "2 uleste mld",
            "3 uleste mld",
            "4 uleste mld",
            "5+ uleste mld",
          ]}
          indexBy="tidsintervall"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          //@ts-ignore
          valueFormat={{ format: " >-", enabled: false }}
          colors={{ scheme: "paired" }}
          defs={[
            {
              id: "dots",
              type: "patternDots",
              background: "inherit",
              color: "#38bcb2",
              size: 4,
              padding: 1,
              stagger: true,
            },
            {
              id: "lines",
              type: "patternLines",
              background: "inherit",
              color: "#eed312",
              rotation: -45,
              lineWidth: 6,
              spacing: 10,
            },
          ]}
          fill={[
            {
              match: {
                id: "fries",
              },
              id: "dots",
            },
            {
              match: {
                id: "sandwich",
              },
              id: "lines",
            },
          ]}
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Varighet",
            legendPosition: "middle",
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Antall sesjoner",
            legendPosition: "middle",
            legendOffset: -50,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          legends={[
            {
              toggleSerie: true,
              dataFrom: "keys",
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: "left-to-right",
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      )}
    </div>
  );
};
