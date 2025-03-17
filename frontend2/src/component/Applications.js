import { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  Paper,
  Typography,
  Modal,
  Box,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Rating from "@mui/lab/Rating";
import axios from "axios";

import { SetPopupContext } from "../App";
import apiList from "../../../frontend2/src/lib/apiList";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
    padding: theme.spacing(4),
    backgroundColor: "#f5f5f5", // Light background for the page
  },
  statusBlock: {
    height: "20px",
    width: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
    borderRadius: "8px",
    padding: theme.spacing(1),
    fontWeight: "bold",
    [theme.breakpoints.down("sm")]: {
      width: "100%", // Full width on mobile
      margin: "auto", // Center the status block
    },
  },
  rightSection: {
    [theme.breakpoints.down("sm")]: {
      width: "100%", // Ensure the right section takes full width on mobile
      marginTop: theme.spacing(2), // Add spacing between sections
      display: "flex",
      flexDirection: "column",
      alignItems: "center", // Center the content horizontally
    },
  },
  jobTileOuter: {
    padding: theme.spacing(3),
    margin: "auto",
    boxSizing: "border-box",
    width: "60vw ",
    borderRadius: "12px",
    backgroundColor: "#ffffff", // White background for cards
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: theme.shadows[8],
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      padding: theme.spacing(2), // Adjust padding for mobile
    },
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  applicationContainer: {
    padding: theme.spacing(4),
    margin: "5%",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2), // Adjust padding for mobile
    },
  },
  title: {
    fontWeight: "bold",
    height: "100%",
    margin: "5%",
    color: theme.palette.primary.main,
    textAlign: "center",
    fontSize: "2.5rem", // Default font size for desktop
    [theme.breakpoints.down("sm")]: {
      fontSize: "2rem !important", // Smaller font size for mobile
    },
  },
  noApplicationsMessage: {
    textAlign: "center !important",
    alignItems: "center",
    margin: "auto",
    color: theme.palette.text.secondary,
    fontSize: "1.5rem", // Default font size for desktop
    [theme.breakpoints.down("sm")]: {
      fontSize: "1rem", // Smaller font size for mobile
    },
  },
  chip: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    backgroundColor: theme.palette.primary.light,
    color: "#ffffff",
  },
  rateButton: {
    marginTop: theme.spacing(2),
    fontWeight: "bold",
    fontSize: "1rem", // Default font size for desktop
    padding: theme.spacing(1.5, 4), // Consistent padding
    transition: "background-color 0.3s ease, transform 0.3s ease",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
      transform: "scale(1.05)",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.875rem", // Smaller font size for mobile
      padding: theme.spacing(1, 3), // Smaller padding for mobile
    },
  },
}));

const ApplicationTile = (props) => {
  const classes = useStyles();
  const { application } = props;
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(application.job.rating);

  const appliedOn = new Date(application.dateOfApplication);
  const joinedOn = new Date(application.dateOfJoining);

  const fetchRating = () => {
    axios
      .get(`${apiList.rating}?id=${application.job._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setRating(response.data.rating);
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: "Error fetching rating",
        });
      });
  };

  const changeRating = () => {
    axios
      .put(
        apiList.rating,
        { rating: rating, jobId: application.job._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: "Rating updated successfully",
        });
        fetchRating();
        setOpen(false);
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        fetchRating();
        setOpen(false);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const colorSet = {
    applied: "#3454D1",
    shortlisted: "#DC851F",
    accepted: "#09BC8A",
    rejected: "#D1345B",
    deleted: "#B49A67",
    cancelled: "#FF8484",
    finished: "#4EA5D9",
  };

  return (
    <Paper className={classes.jobTileOuter} elevation={3}>
      <Grid container spacing={2}>
        {/* Left Section: Job Details */}
        <Grid item xs={12} md={9}>
          <Typography variant="h5" gutterBottom style={{ fontWeight: "bold" }}>
            {application.job.title}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Posted By: {application.recruiter.name}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Role: {application.job.jobType}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Salary: &#8377; {application.job.salary} per month
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Duration:{" "}
            {application.job.duration !== 0
              ? `${application.job.duration} month`
              : `Flexible`}
          </Typography>
          <Box mt={1}>
            {application.job.skillsets.map((skill, index) => (
              <Chip key={index} label={skill} className={classes.chip} />
            ))}
          </Box>
          <Typography variant="body1" color="textSecondary" mt={1}>
            Applied On: {appliedOn.toLocaleDateString()}
          </Typography>
          {(application.status === "accepted" ||
            application.status === "finished") && (
            <Typography variant="body1" color="textSecondary">
              Joined On: {joinedOn.toLocaleDateString()}
            </Typography>
          )}
        </Grid>

        {/* Right Section: Status and Rating */}
        <Grid
          item
          container
          direction="column"
          xs={12}
          md={3}
          spacing={2}
          className={classes.rightSection} // Apply mobile-specific styles
        >
          <Grid item>
            <Paper
              className={classes.statusBlock}
              style={{
                background: colorSet[application.status],
                color: "#ffffff",
              }}
            >
              {application.status}
            </Paper>
          </Grid>
          {(application.status === "accepted" ||
            application.status === "finished") && (
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                className={classes.rateButton}
                onClick={() => {
                  fetchRating();
                  setOpen(true);
                }}
                fullWidth
              >
                Rate Job
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Modal for Rating */}
      <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "30%",
            alignItems: "center",
            borderRadius: "12px",
          }}
        >
          <Rating
            name="simple-controlled"
            style={{ marginBottom: "30px" }}
            value={rating === -1 ? null : rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ padding: "10px 50px" }}
            onClick={changeRating}
          >
            Submit
          </Button>
        </Paper>
      </Modal>
    </Paper>
  );
};

const Applications = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(apiList.applications, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setApplications(response.data);
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: "Error fetching applications",
        });
      });
  };

  return (
    <Grid container className={classes.applicationContainer}>
      <Grid item xs={12} style={{ height: "100%", margin: "5%" }}>
        <Typography variant="h2" className={classes.title}>
          Applications
        </Typography>
      </Grid>
      <Grid item container spacing={3} style={{ margin: "auto" }}>
        {applications.length > 0 ? (
          applications.map((obj, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              style={{ width: "100%", padding: "0" }}
            >
              <ApplicationTile application={obj} />
            </Grid>
          ))
        ) : (
          <Typography
            variant="h5"
            className={classes.noApplicationsMessage}
            style={{ width: "100%", margin: "auto" }}
          >
            No Applications Found
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default Applications;
