import React from "react";
import { Grid, Typography, useTheme, useMediaQuery } from "@mui/material";

const Welcome = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Detect small screens

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ padding: "30px", minHeight: "93vh", textAlign: "center" }}
    >
      <Typography
        variant="h2"
        sx={{
          fontSize: isSmallScreen ? "2rem" : "3.5rem",
          fontWeight: "bold",
        }}
      >
        Welcome to{" "}
        <span style={{ color: "black", fontWeight: "bold" }}>Ava</span>
        <span style={{ fontWeight: "bold", color: "blue" }}>Intern</span> 's Job
        Portal
      </Typography>

      <Grid item sx={{ mt: 3, width: isSmallScreen ? "80%" : "100%" }}>
        <img
          src="/logo_avaintern.jpg"
          alt="Logo"
          style={{
            maxWidth: isSmallScreen ? "60%" : "30%",
            height: "auto",
          }}
        />
      </Grid>

      <Typography
        variant="h5"
        sx={{
          fontSize: isSmallScreen ? "1rem" : "2rem",
          mt: 2,
          maxWidth: "80%",
          fontWeight: "400",
        }}
      >
        "Choose AvaIntern to accelerate your professional career growth !!!"
      </Typography>
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          fontSize: isSmallScreen ? "1rem" : "1.5rem",
          mt: 2,
          maxWidth: "100%",
        }}
      ></Typography>
    </Grid>
  );
};

export const ErrorPage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ padding: "30px", minHeight: "93vh", textAlign: "center" }}
    >
      <Typography
        variant="h2"
        sx={{ fontSize: isSmallScreen ? "1.5rem" : "3rem", fontWeight: "bold" }}
      >
        Error 404
      </Typography>
    </Grid>
  );
};

export default Welcome;
