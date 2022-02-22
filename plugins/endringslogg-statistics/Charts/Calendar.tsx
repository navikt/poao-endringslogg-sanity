import React from "react";
import {
  convertFromUTCDate,
  convertToUTCDate,
  dateFormatter,
  datesAsObj,
} from "../utils";
import { ResponsiveTimeRange } from "@nivo/calendar";
import { UserData } from "../types";
import { Box, CircularProgress } from "@material-ui/core";
import { useStyles } from "../StatsPanel";
import { addDays, eachDayOfInterval, isEqual } from "date-fns";

const userDataToCalendarData = (
  userData: UserData[],
  dateRange: { start: Date; end: Date },
  id: string
) => {
  const dateStringArray = userData
    .filter((entry) => entry.documentId === id)
    .map((entry) => {
      const time = dateFormatter(convertFromUTCDate(new Date(entry.timeStamp)));
      return time;
    });

  const dateCountObj = dateStringArray.reduce(
    (acc, date) => ({
      ...acc,
      ...(acc?.[date] >= 0 ? { [date]: ++acc[date] } : {}),
    }),

    datesAsObj(
      eachDayOfInterval({
        start: addDays(dateRange.start, 1),
        end: addDays(dateRange.end, 1),
      })
    )
  );
  return Object.entries(dateCountObj).map(([date, count]) => ({
    value: count,
    day: date,
  }));
};

const colorsBlue = [
  "#dfdfdf",
  "#c9cdd6",
  "#b3bbce",
  "#9ca9c5",
  "#8598bc",
  "#6e87b3",
  "#5576ab",
  "#3866a2",
  "#005799",
];

export const Calendar = ({
  userData,
  loadingUserData,
  dateRange,
  id,
}: {
  userData: UserData[];
  loadingUserData: boolean;
  dateRange: { start: Date; end: Date };
  id: string;
}) => {
  const classes = useStyles();
  return (
    <Box height="15vw" className={classes.timeRange}>
      <h1 style={{ textAlign: "center" }}>Antall meldinger sett per dag</h1>
      {loadingUserData ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </div>
      ) : (
        <ResponsiveTimeRange
          legendFormat={(value) => value.toString()}
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              itemCount: 4,
              itemWidth: 42,
              itemHeight: 36,
              itemsSpacing: 14,
              translateY: -30,
            },
          ]}
          weekdayTicks={[]} // hide weekday tickmarks
          //@ts-ignore
          from={dateRange?.start ? dateRange.start : new Date("1900-01-01")}
          to={dateRange?.end ? dateRange.end : new Date()}
          /* https://github.com/plouc/nivo/pull/1722
           * Currently unable to set default color for empty days, which makes
           * it very difficult to distinguish between smaller numbers and 0.
           * An update which does this has been merged into @nivo master,
           * but a new version has not yet been published to NPM.
           */
          emptyColor="#eeeeee"
          colors={colorsBlue}
          data={userDataToCalendarData(userData, dateRange, id)}
          {...{
            dayRadius: "0rem",
            formatValue: (value: any) => value,
            margin: {
              top: 40,
              right: 40,
              bottom: 40,
              left: 40,
            },
          }}
        />
      )}
    </Box>
  );
};
