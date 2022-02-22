import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    height: 350,
  },
});

const valuetext = (value: number) => {
  return `${value} sekunder`;
};

const marks = [
  {
    value: 0,
    label: "0 sek.",
  },
  {
    value: 15,
    label: "15 sek.",
  },
  {
    value: 30,
    label: "30 sek.",
  },
  {
    value: 45,
    label: "45 sek.",
  },
  {
    value: 60,
    label: "60 sek.",
  },
  {
    value: 75,
    label: "75 sek.",
  },
  {
    value: 90,
    label: "90 sek.",
  },
  {
    value: 105,
    label: "105 sek.",
  },
  {
    value: 120,
    label: "120+ sek.",
  },
];

export const DateIntervalSlider = ({
  setUpperMs,
  setLowerMs,
}: {
  setUpperMs: (seconds: number) => void;
  setLowerMs: (seconds: number) => void;
}) => {
  const classes = useStyles();
  const handleChangeMs = (value: number[]) => {
    setLowerMs(value[0]);
    setUpperMs(value[1]);
  };
  return (
    <Grid container item>
      <Grid item xs={12}>
        <Typography gutterBottom>Filtrer tid sett</Typography>
      </Grid>
      <Grid item xs={12}>
        <div className={classes.root}>
          <Slider
            //@ts-ignore
            onChangeCommitted={(event, value) => handleChangeMs(value)}
            min={0}
            step={1}
            max={120}
            orientation="vertical"
            defaultValue={[0, 120]}
            aria-labelledby="vertical-slider"
            getAriaValueText={valuetext}
            marks={marks}
            valueLabelDisplay="auto"
          />
        </div>
      </Grid>
    </Grid>
  );
};
