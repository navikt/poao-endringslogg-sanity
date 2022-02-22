import React, { useEffect, useState } from "react";
import { withRouterHOC } from "part:@sanity/base/router";
import client from "part:@sanity/base/client";
import schema from "part:@sanity/base/schema";
import DateFnsUtils from "@date-io/date-fns";
import { DocumentPie } from "./Charts/Pie";
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
  Slider,
} from "@material-ui/core";
import {
  createTheme,
  makeStyles,
  responsiveFontSizes,
  ThemeProvider,
  withStyles,
} from "@material-ui/core/styles";
import { Calendar } from "./Charts/Calendar";
import { ViewsCard } from "./Charts/ViewsCard";
import {
  App,
  SanityDocument,
  UserData,
  UserSessionData,
  UniqueUsersPerDayData,
} from "./types";
import { TimePerUnseenField } from "./Charts/TimePerUnseenField";
import { InfoCard } from "./Charts/InfoCard";
import { UniqueUsersPerDay } from "./Charts/UniqueUsersPerDay";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import {
  isAfter,
  isBefore,
  startOfDay,
  subMonths,
  endOfDay,
  isWithinInterval,
} from "date-fns";
import nbLocale from "date-fns/locale/nb";
import { DateIntervalSlider } from "./Charts/DateIntervalSlider";

const backendUrl = "https://familie-endringslogg.dev.intern.nav.no";

const CustomTab = withStyles({
  root: {
    textTransform: "none",
    textAlign: "left",
    minWidth: "100%",
    color: "black",
  },
  wrapper: {
    minWidth: "100%",
    alignItems: "flex-start",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    display: "inline-block",
  },
})(Tab);

const theme = responsiveFontSizes(createTheme(), {
  breakpoints: ["sm", "md", "lg", "xl"],
  factor: 4.0,
});

export const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    height: "100vh",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 240,
  },
  select: {
    backgroundColor: "white",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  tabs: {
    maxHeight: "75vh",
    [theme.breakpoints.down("md")]: {
      maxHeight: "30vh",
    },
  },
  timeRange: {
    height: "15vw",
    marginTop: "4rem",
    [theme.breakpoints.down("md")]: {
      height: "25vw",
    },
  },
  documentPie: {
    [theme.breakpoints.down("lg")]: {
      margin: "0 auto",
    },
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

export const StatsPanel = withRouterHOC(({ router }: { router: any }) => {
  const classes = useStyles();
  const [documents, setDocuments] = useState<SanityDocument[]>([]);
  const [userData, setUserData] = useState<UserData[]>([]);
  const [filteredUserData, setFilteredUserData] = useState<UserData[]>([]);
  const [userSessionData, setUserSessionData] = useState<UserSessionData[]>([]);
  const [filteredUserSessionData, setFilteredUserSessionData] = useState<
    UserSessionData[]
  >([]);
  const [uniqueUsersPerDayData, setUniqueUsersPerDayData] = useState<
    UniqueUsersPerDayData[]
  >([]);
  const [loadingUserData, setLoadingUserData] = useState<boolean>(false);
  const [loadingUserSessionData, setLoadingUserSessionData] =
    useState<boolean>(false);
  const [loadingUniqueUsersData, setloadingUniqueUsersData] =
    useState<boolean>(false);
  const [filterMsUpper, setfilterMsUpper] = useState<number>(120000);
  const [filterMsLower, setfilterMsLower] = useState<number>(0);

  const handleSetFilterMsUpper = (seconds: number) => {
    if (seconds === 120) {
      setfilterMsUpper(1000000000);
    }
    setfilterMsUpper(seconds * 1000);
  };

  const handleSetFilterMsLower = (seconds: number) => {
    setfilterMsLower(seconds * 1000);
  };

  const [startDate, setStartDate] = React.useState<Date | null>(
    startOfDay(subMonths(new Date(), 1))
  );
  const [endDate, setEndDate] = React.useState<Date | null>(
    endOfDay(new Date())
  );
  const [dateErr, setDateErr] = React.useState<{
    startDate: boolean;
    endDate: boolean;
  }>({
    startDate: false,
    endDate: false,
  });

  const [app, setApp] = useState<App>({ name: "", _type: "" });
  const [tab, setTab] = useState<string>("");

  const handleAppChange = (event: any) => {
    setApp(event.target.value);
    setTab("");
  };

  const handleTabChange = (_: any, newTabValue: string) => {
    setTab(newTabValue);
  };

  const handleStartDateChange = (value: Date | null) => {
    if (isAfter(value!, endDate!)) {
      setDateErr({ ...dateErr, startDate: true });
    } else {
      setStartDate(startOfDay(value!));
      setDateErr({ startDate: false, endDate: false });
    }
  };

  const handleEndDateChange = (value: Date | null) => {
    if (isBefore(value!, startDate!)) {
      setDateErr({ ...dateErr, endDate: true });
    } else {
      setEndDate(endOfDay(value!));
      setDateErr({ startDate: false, endDate: false });
    }
  };

  // Remove focus from menu when an app has been selected
  const handleExitMenu = (node: HTMLElement) => {
    //@ts-ignore
    document.activeElement.blur();
  };

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

  useEffect(() => {
    if (app._type) {
      setLoadingUserData(true);
      setLoadingUserSessionData(true);
      setloadingUniqueUsersData(true);
      fetch(`${backendUrl}/data/seen-app?appId=${app._type}`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((resp) =>
        resp.json().then((data: UserData[]) => {
          const filteredData = data.filter((entry) =>
            isWithinInterval(new Date(entry.timeStamp), {
              start: startDate!,
              end: endDate!,
            })
          );
          setLoadingUserData(false);
          setUserData(data);
          setFilteredUserData(filteredData);
        })
      );

      fetch(`${backendUrl}/data/user-session-all?appId=${app._type}`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((resp) =>
        resp.json().then((data: UserSessionData[]) => {
          const filteredData = data.filter((entry) =>
            isWithinInterval(new Date(entry.timeStamp), {
              start: startDate!,
              end: endDate!,
            })
          );
          setLoadingUserSessionData(false);
          setUserSessionData(data);
          setFilteredUserSessionData(filteredData);
        })
      );
    }
  }, [app]);

  useEffect(() => {
    if (app._type) {
      fetch(
        `${backendUrl}/data/unique-user-sessions-per-day?appId=${app._type}&moreThanMs=${filterMsLower}&lessThanMs=${filterMsUpper}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((resp) =>
        resp.json().then((a) => {
          setloadingUniqueUsersData(false);
          setUniqueUsersPerDayData(a);
        })
      );
    }
  }, [app, filterMsLower, filterMsUpper]);

  useEffect(() => {
    if (userData) {
      setFilteredUserData(
        userData.filter((entry) =>
          isWithinInterval(new Date(entry.timeStamp), {
            start: startDate!,
            end: endDate!,
          })
        )
      );
    }
    if (userSessionData) {
      setFilteredUserSessionData(
        userSessionData.filter((entry) =>
          isWithinInterval(new Date(entry.timeStamp), {
            start: startDate!,
            end: endDate!,
          })
        )
      );
    }
  }, [startDate, endDate]);

  return (
    <ThemeProvider theme={theme}>
      <Grid container>
        <Grid container item xl={2} lg={3} md={12} sm={12} xs={12}>
          <div style={{ width: "99%", height: "100%" }}>
            <Box mr={1}>
              <FormControl
                fullWidth
                variant="filled"
                className={classes.formControl}
              >
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
            </Box>
            {app?._type && (
              <>
                <Box ml={1}>
                  <MuiPickersUtilsProvider
                    utils={DateFnsUtils}
                    locale={nbLocale}
                  >
                    <Grid container item>
                      <Grid item xs={6}>
                        <div style={{ width: "99%", height: "100%" }}>
                          <KeyboardDatePicker
                            fullWidth
                            variant="inline"
                            onChange={handleStartDateChange}
                            {...(dateErr.startDate
                              ? {
                                  label: "Feil: Må være før sluttdato ",
                                  error: true,
                                }
                              : { label: "Startdato", error: false })}
                            value={startDate}
                          />
                        </div>
                      </Grid>
                      <Grid item xs={6}>
                        <KeyboardDatePicker
                          fullWidth
                          variant="inline"
                          onChange={handleEndDateChange}
                          {...(dateErr.endDate
                            ? {
                                label: "Feil: Må være etter startdato ",
                                error: true,
                              }
                            : { label: "Sluttdato", error: false })}
                          value={endDate}
                        />
                      </Grid>
                    </Grid>
                  </MuiPickersUtilsProvider>
                </Box>
                <Box ml={1}>
                  <Card elevation={1}>
                    <Tabs
                      className={classes.tabs}
                      orientation="vertical"
                      variant="scrollable"
                      value={tab}
                      onChange={handleTabChange}
                      aria-label="Liste over innslag i endringslogg"
                      TabIndicatorProps={{
                        style: {
                          left: "0px",
                        },
                      }}
                    >
                      <CustomTab
                        style={{ backgroundColor: "whitesmoke" }}
                        label={<em>Oversikt</em>}
                        value=""
                      />
                      {documents
                        .filter((doc) =>
                          app.name === "" ? false : doc.appName === app.name
                        )
                        .sort((a, b) => (a._updatedAt < b._updatedAt ? 1 : -1))
                        .map((doc, idx) => (
                          <CustomTab
                            style={{
                              borderTop: "0.1rem dotted gray",
                            }}
                            key={idx}
                            value={doc._id}
                            label={doc.title}
                          ></CustomTab>
                        ))}
                    </Tabs>
                  </Card>
                </Box>
              </>
            )}
          </div>
        </Grid>

        {app?._type && (
          <Grid
            container
            spacing={10}
            justifyContent="center"
            item
            xl={10}
            lg={9}
            md={12}
            sm={12}
            xs={12}
          >
            <Grid item xl={4} lg={6} md={6} sm={12} xs={12}>
              {!!documents && !!tab && (
                <InfoCard
                  document={documents.find((doc) => doc._id == tab)!}
                  appId={app._type}
                />
              )}
            </Grid>
            <Grid item xl={3} lg={6} md={6} sm={12} xs={12}>
              {!!userData && !!tab && (
                <ViewsCard
                  userData={userData}
                  filteredUserData={filteredUserData}
                  loadingUserData={loadingUserData}
                  id={tab}
                />
              )}
            </Grid>
            <Grid item xl={5} lg={12} md={12} sm={12} xs={12}>
              {!!userData && !!tab && (
                <DocumentPie
                  data={filteredUserData.filter(
                    (entry) => entry.documentId === tab
                  )}
                  loadingUserData={loadingUserData}
                  id={tab}
                />
              )}
            </Grid>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
              {!!userData && !!tab && (
                <Calendar
                  userData={filteredUserData}
                  loadingUserData={loadingUserData}
                  dateRange={{ start: startDate!, end: endDate! }}
                  id={tab}
                />
              )}
            </Grid>
            {!tab && (
              <Grid item xl={12} lg={12} md={12} sm={12}>
                <TimePerUnseenField
                  loadingUserSessionData={loadingUserSessionData}
                  data={filteredUserSessionData}
                />
              </Grid>
            )}

            {!tab && documents && (
              <Grid
                container
                item
                justifyContent="flex-end"
                alignItems="flex-end"
              >
                <Grid
                  item
                  xl={1}
                  lg={1}
                  md={1}
                  sm={2}
                  justifyContent="flex-end"
                >
                  <DateIntervalSlider
                    setUpperMs={handleSetFilterMsUpper}
                    setLowerMs={handleSetFilterMsLower}
                  />
                </Grid>
                <Grid item xl={11} lg={11} md={11} sm={10}>
                  <UniqueUsersPerDay
                    loadingUniqueUsersData={loadingUniqueUsersData}
                    dateRange={{ start: startDate!, end: endDate! }}
                    data={uniqueUsersPerDayData}
                    documents={documents.filter(
                      (doc) => doc._type === app._type
                    )}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
        )}
      </Grid>
    </ThemeProvider>
  );
});
