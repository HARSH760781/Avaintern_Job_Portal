// src/components/Loader.js

import React, { useContext } from "react";
import { RingLoader } from "react-spinners";
import { makeStyles } from "@mui/styles";
import { LoadingContext } from "../context/LoadingContext";

const useStyles = makeStyles(() => ({
  spinnerOverlay: {
    position: "fixed",
    top: "50%",
    left: "50%",
    width: "100px",
    height: "100px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "url('favicon.ico')", // Replace with your logo image path
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    opacity: 0.8,
    zIndex: 1000,
    transform: "translate(-50%, -50%)",
  },
  spinner: {
    position: "absolute",
    zIndex: 2000,
  },
}));

const Loader = () => {
  const classes = useStyles();
  const { loading } = useContext(LoadingContext); // Access global loading state

  if (!loading) return null; // Do not render loader if not loading

  return (
    <div className={classes.spinnerOverlay}>
      <RingLoader className={classes.spinner} size={50} color="#36d7b7" />
    </div>
  );
};

export default Loader;
