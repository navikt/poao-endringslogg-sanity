import React, { useEffect, useState } from "react";
import { SanityDocument, UniqueUsersPerDayData } from "../types";
import { ResponsiveLine } from "@nivo/line";
import { Box, Card, CircularProgress, Typography } from "@material-ui/core";
import { eachDayOfInterval, isWithinInterval } from "date-fns";
import { dateFormatter } from "../utils";
import { addDays } from "date-fns/esm";

const fillInEmptyIsoStrings = (
  data: UniqueUsersPerDayData[],
  startDate: string,
  endDate: string
) => {
  const dataLUT = data.reduce(
    (acc, entry) => ({
      ...acc,
      [entry.date]: entry.users,
    }),
    {} as { [key: string]: number }
  );
  return eachDayOfInterval({
    start: addDays(new Date(startDate), 2),
    end: addDays(new Date(endDate), 1),
  })
    .map((day) => ({
      date: dateFormatter(day),
      users: 0,
    }))
    .map((entry) => ({
      ...entry,
      ...(dataLUT[entry.date] ? { users: dataLUT[entry.date] } : {}),
    }));
};

const formatUniqueUsersPerDayData = (
  uniqueUsersPerDayData: UniqueUsersPerDayData[],
  dateRange: { start: Date; end: Date }
) => {
  const formattedData = fillInEmptyIsoStrings(
    uniqueUsersPerDayData,
    dateFormatter(dateRange.start),
    dateFormatter(dateRange.end)
  ).map(({ date, users }) => ({
    x: date,
    y: users,
  }));

  // add dates that don't exists for last month
  return [
    {
      id: "# Unike brukere per dag",
      color: "hsl(70%, 50%",
      data: formattedData,
    },
  ];
};

export const UniqueUsersPerDay = ({
  data,
  dateRange,
  loadingUniqueUsersData,
  documents,
}: {
  data: UniqueUsersPerDayData[];
  dateRange: { start: Date; end: Date };
  loadingUniqueUsersData: boolean;
  documents: SanityDocument[];
}) => {
  const [localData, setLocalData] = useState<UniqueUsersPerDayData[]>([]);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    setLocalData([]);
    setCount(count + 1);
  }, [data, dateRange]);

  useEffect(() => {
    setLocalData(
      data.filter((entry) =>
        isWithinInterval(new Date(entry.date), {
          start: dateRange.start,
          end: dateRange.end,
        })
      )
    );
  }, [count]);

  return (
    <div style={{ height: "30rem" }}>
      <h1 style={{ textAlign: "center" }}> Antall unike brukere per dag</h1>
      {loadingUniqueUsersData ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </div>
      ) : (
        !!localData.length && (
          <ResponsiveLine
            animate={false}
            data={formatUniqueUsersPerDayData(localData, dateRange)}
            layers={[
              "grid",
              "axes",
              "areas",
              "crosshair",
              "lines",
              "points",
              "slices",
              "mesh",
              "legends",
              "markers",
            ]}
            //@ts-ignore
            markers={documents
              .sort((a, b) => (a.date < b.date ? -1 : 1))
              .filter((doc) =>
                isWithinInterval(new Date(doc.date), {
                  start: dateRange.start,
                  end: dateRange.end,
                })
              )
              .map((doc, idx, docs) => {
                if (idx === docs.length - 1) return { ...doc, noBar: false };
                if (
                  dateFormatter(new Date(doc.date)) ===
                  dateFormatter(new Date(docs[idx + 1].date))
                )
                  return { ...doc, noBar: true };
                return { ...doc, noBar: false };
              })
              .map((doc, idx, docs) => ({
                axis: "x",
                value: dateFormatter(new Date(doc.date)),
                lineStyle: doc.noBar
                  ? { strokeWidth: 0 }
                  : {
                      stroke: "gray",
                      strokeWidth: 2,
                      strokeDasharray: "10, 10",
                    },
                textStyle: {
                  textShadow: "0.05rem 0.05rem floralWhite",
                  transform: `translate(0.2rem, ${
                    (idx / docs.length) * 20 + 1.0
                  }rem)`,
                },
                legend:
                  doc.title.length > 20
                    ? doc.title.slice(0, 17) + "..."
                    : doc.title,
                legendOrientation: "horizontal",
              }))
              .reverse()}
            margin={{ top: 50, right: 110, bottom: 60, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: true,
              reverse: false,
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            colors={{ scheme: "paired" }}
            axisBottom={{
              tickSize: 0,
              format: (tick) => {
                const day = Math.floor(new Date(tick).getTime() / 8.64e7);
                if (Math.floor(localData.length / 30) === 0) return tick;
                return day % Math.floor(localData.length / 30) === 0
                  ? tick
                  : "";
              },
              tickPadding: 0,
              tickRotation: -90,
              legend: "",
              legendOffset: 45,
              legendPosition: "middle",
            }}
            axisLeft={{
              //removed: orient: "left", which for some reason caused red lines to appear in the entire component
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Antall unike brukere",
              legendOffset: -40,
              legendPosition: "middle",
            }}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            enableSlices="x"
            enableArea
            sliceTooltip={({ slice }) => (
              <div>
                {slice.points.map((point) => (
                  <Card>
                    <Box p={2}>
                      <Typography>
                        <b>Dato:</b> {point.data.xFormatted}
                      </Typography>
                      <Typography>
                        <b>Antall:</b>{" "}
                        {point.data.yFormatted.toString().slice(0, -3)}
                      </Typography>
                    </Box>
                  </Card>
                ))}
              </div>
            )}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        )
      )}
    </div>
  );
};

/*
Antall unike brukere av komponenten per dag innenfor et gitt tidsintervall.

1. (Datapunkt backend)
2. Trenger datastruktur:
data = [
    {
        day: Date;
        visitors: integer;
        (new_post: boolean);
    }
]

3. Splitte på dato
4. for hver dato, finne unike brukere:
    https://www.freecodecamp.org/news/15-useful-javascript-examples-of-map-reduce-and-filter-74cbbb5e0a1f/
5. for hver dato -> lagre i objekt

select time_stamp, count(distinct user_id) AS ant_unike_brukere from user_session group by time_stamp;

*/

/*
SELECT
    time_stamp::date as date,
    count(distinct user_id) AS ant_unike_brukere
FROM user_session
WHERE
    time_stamp > current_date - interval '30 days' AND
    duration > 2000
GROUP BY time_stamp::date
ORDER BY time_stamp::date ASC;
*/

/*
!!! husk å legge til eventuelle datapunkter for dager som ikke eksisterer


*/
