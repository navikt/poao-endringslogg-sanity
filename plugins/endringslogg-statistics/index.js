import React from "react";
import { route } from "part:@sanity/base/router";
import { StatsPanel } from "./StatsPanel";
import StatsIcon from "./StatsIcon";

export default {
  title: "Statistikk",
  name: "statistics",
  router: route("/:selectedDocumentId"),
  icon: StatsIcon,
  component: StatsPanel,
};
