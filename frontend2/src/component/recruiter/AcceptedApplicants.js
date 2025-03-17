import { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  Modal,
  Slider,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Checkbox,
  Avatar,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useParams } from "react-router-dom";
import Rating from "@mui/lab/Rating";
import axios from "axios";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import { SetPopupContext } from "../../App";

import apiList, { server } from "../../../../frontend2/src/lib/apiList";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  statusBlock: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
    [theme.breakpoints.down("md")]: {
      height: "auto",
      fontSize: "10px",
    },
  },
  jobTileOuter: {
    padding: "30px",
    margin: "20px 0",
    boxSizing: "border-box",
    width: "100%",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: theme.spacing(17),
    height: theme.spacing(17),
  },
}));

const FilterPopup = (props) => {
  const classes = useStyles();
  const { open, handleClose, searchOptions, setSearchOptions, getData } = props;

  return (
    <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
      <Paper
        style={{
          padding: "20px",
          outline: "none",
          minWidth: "80%", // Wider on mobile
          maxWidth: "500px", // Constrain width on desktop
          width: "90%", // Full width on mobile
          margin: "auto", // Center the modal
          maxHeight: "90vh", // Ensure modal doesn't exceed screen height
          overflowY: "auto", // Enable vertical scrolling
        }}
      >
        <Grid container direction="column" alignItems="center" spacing={3}>
          {/* Sort Section */}
          <Grid container item alignItems="center" spacing={2}>
            <Grid item xs={12} sm={3}>
              <Typography>Sort</Typography>
            </Grid>
            <Grid container item xs={12} sm={9} spacing={2}>
              {["name", "jobTitle", "dateOfJoining", "rating"].map((field) => (
                <Grid item xs={12} sm={6} key={field}>
                  <Paper
                    style={{
                      padding: "10px",
                      border: "1px solid #D1D1D1",
                      borderRadius: "5px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          name={field}
                          checked={searchOptions.sort[field].status}
                          onChange={(event) =>
                            setSearchOptions({
                              ...searchOptions,
                              sort: {
                                ...searchOptions.sort,
                                [field]: {
                                  ...searchOptions.sort[field],
                                  status: event.target.checked,
                                },
                              },
                            })
                          }
                        />
                      }
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                    />
                    <IconButton
                      disabled={!searchOptions.sort[field].status}
                      onClick={() => {
                        setSearchOptions({
                          ...searchOptions,
                          sort: {
                            ...searchOptions.sort,
                            [field]: {
                              ...searchOptions.sort[field],
                              desc: !searchOptions.sort[field].desc,
                            },
                          },
                        });
                      }}
                    >
                      {searchOptions.sort[field].desc ? (
                        <ArrowDownwardIcon />
                      ) : (
                        <ArrowUpwardIcon />
                      )}
                    </IconButton>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Apply Button */}
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              style={{ padding: "10px 50px" }}
              onClick={() => getData()}
            >
              Apply
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};
const ApplicationTile = (props) => {
  const classes = useStyles();
  const { application, getData } = props;
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  const [openEndJob, setOpenEndJob] = useState(false);
  const [rating, setRating] = useState(application.jobApplicant.rating);

  const appliedOn = new Date(application.dateOfApplication);

  const changeRating = () => {
    axios
      .put(
        apiList.rating,
        { rating: rating, applicantId: application.jobApplicant.userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setPopup({
          open: true,
          severity: "success",
          message: "Rating updated successfully",
        });
        getData();
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        getData();
        setOpen(false);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseEndJob = () => {
    setOpenEndJob(false);
  };

  const getResume = () => {
    if (
      application.jobApplicant.resume &&
      application.jobApplicant.resume !== ""
    ) {
      const address = `${server}${application.jobApplicant.resume}`;
      console.log(address);
      axios(address, {
        method: "GET",
        responseType: "blob",
      })
        .then((response) => {
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        })
        .catch((error) => {
          console.log(error);
          setPopup({
            open: true,
            severity: "error",
            message: "Error",
          });
        });
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "No resume found",
      });
    }
  };

  const updateStatus = (status) => {
    const address = `${apiList.applications}/${application._id}`;
    const statusData = {
      status: status,
      dateOfJoining: new Date().toISOString(),
    };
    axios
      .put(address, statusData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        handleCloseEndJob();
        getData();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        console.log(err.response);
        handleCloseEndJob();
      });
  };

  return (
    <Paper className={classes.jobTileOuter} elevation={3}>
      <Grid container spacing={2}>
        {/* Avatar Section */}
        <Grid
          item
          xs={12}
          sm={2}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar
            src={`${server}${application.jobApplicant.profile}`}
            className={classes.avatar}
            style={{ width: "80px", height: "80px" }} // Smaller avatar on mobile
          />
        </Grid>

        {/* Applicant Details Section */}
        <Grid
          container
          item
          xs={12}
          sm={7}
          spacing={1}
          direction="column"
          style={{ padding: "10px" }}
        >
          <Grid item>
            <Typography variant="h5" style={{ fontSize: "1.5rem" }}>
              {application.jobApplicant.name}
            </Typography>
          </Grid>
          <Grid item>
            <Rating
              value={
                application.jobApplicant.rating !== -1
                  ? application.jobApplicant.rating
                  : null
              }
              readOnly
            />
          </Grid>
          <Grid item>Job Title: {application.job.title}</Grid>
          <Grid item>Role: {application.job.jobType}</Grid>
          <Grid item>Applied On: {appliedOn.toLocaleDateString()}</Grid>
          <Grid item>
            SOP: {application.sop !== "" ? application.sop : "Not Submitted"}
          </Grid>
          <Grid item>
            {application.jobApplicant.skills.map((skill) => (
              <Chip label={skill} style={{ marginRight: "2px" }} key={skill} />
            ))}
          </Grid>
        </Grid>

        {/* Buttons Section */}
        <Grid
          item
          container
          xs={12}
          sm={3}
          direction={{ xs: "row", sm: "column" }} // Row on mobile, column on desktop
          spacing={2}
          justifyContent={{ xs: "space-between", sm: "flex-start" }} // Space between buttons on mobile
          alignItems={{ xs: "center", sm: "flex-end" }} // Align buttons to the right on desktop
          style={{
            padding: "10px",
            height: "100%",
          }}
        >
          <Grid item xs={4} sm={12} style={{ width: "100%" }}>
            <Button
              variant="contained"
              className={classes.statusBlock}
              color="primary"
              onClick={() => getResume()}
              fullWidth // Full width on mobile
              style={{
                padding: "10px",
                background: "blue",
                fontSize: "10px", // Consistent font size
                height: "40px", // Consistent height
                marginBottom: { xs: "0", sm: "10px" }, // Add margin between buttons on desktop
              }}
            >
              Download Resume
            </Button>
          </Grid>
          <Grid item xs={4} sm={12} style={{ width: "100%" }}>
            <Button
              variant="contained"
              color="primary"
              className={classes.statusBlock}
              style={{
                padding: "10px",
                background: "black",
                fontSize: "10px", // Consistent font size
                height: "40px", // Consistent height
                marginBottom: { xs: "0", sm: "10px" }, // Add margin between buttons on desktop
              }}
              onClick={() => {
                setOpenEndJob(true);
              }}
              fullWidth // Full width on mobile
            >
              End Job
            </Button>
          </Grid>
          <Grid item xs={4} sm={12} style={{ width: "100%" }}>
            <Button
              variant="contained"
              color="primary"
              className={classes.statusBlock}
              onClick={() => {
                setOpen(true);
              }}
              style={{
                padding: "10px",
                background: "blue",
                fontSize: "10px", // Consistent font size
                height: "40px", // Consistent height
                marginBottom: { xs: "0", sm: "10px" }, // Add margin between buttons on desktop
              }}
              fullWidth // Full width on mobile
            >
              Rate Applicant
            </Button>
          </Grid>
        </Grid>
      </Grid>

      {/* Rating Modal */}
      <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "80%", // Wider on mobile
            maxWidth: "400px", // Constrain width on desktop
            alignItems: "center",
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
            onClick={() => changeRating()}
          >
            Submit
          </Button>
        </Paper>
      </Modal>

      {/* End Job Modal */}
      <Modal
        open={openEndJob}
        onClose={handleCloseEndJob}
        className={classes.popupDialog}
      >
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "80%", // Wider on mobile
            maxWidth: "400px", // Constrain width on desktop
            alignItems: "center",
          }}
        >
          <Typography variant="h4" style={{ marginBottom: "10px" }}>
            Are you sure?
          </Typography>
          <Grid container justify="center" spacing={5}>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                style={{ padding: "10px 50px" }}
                onClick={() => updateStatus("finished")}
              >
                Yes
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                style={{ padding: "10px 50px" }}
                onClick={() => handleCloseEndJob()}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    </Paper>
  );
};

const AcceptedApplicants = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    sort: {
      name: {
        status: false,
        desc: false,
      },
      jobTitle: {
        status: false,
        desc: false,
      },
      dateOfJoining: {
        status: true,
        desc: true,
      },
      rating: {
        status: false,
        desc: false,
      },
    },
  });

  useEffect(() => {
    getData();
  }, []);
  const getData = () => {
    let searchParams = [];
    searchParams = [...searchParams, `status=accepted`];

    let asc = [],
      desc = [];

    Object.keys(searchOptions.sort).forEach((obj) => {
      const item = searchOptions.sort[obj];
      if (item.status) {
        if (item.desc) {
          desc = [...desc, `desc=${obj}`];
        } else {
          asc = [...asc, `asc=${obj}`];
        }
      }
    });

    searchParams = [...searchParams, ...asc, ...desc];
    const queryString = searchParams.join("&");
    console.log(queryString);
    let address = `${apiList.applicants}`;
    if (queryString !== "") {
      address = `${address}?${queryString}`;
    }

    console.log(address);

    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setApplications(response.data);
      })
      .catch((err) => {
        console.log(err.response);
        setApplications([]);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
      });
  };
  return (
    <>
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        style={{ padding: "30px", minHeight: "93vh" }}
      >
        <Grid item>
          <Typography
            variant="h2"
            style={{ fontSize: "2rem", textAlign: "center" }}
          >
            Employees
          </Typography>
        </Grid>
        <Grid item>
          <IconButton onClick={() => setFilterOpen(true)}>
            <FilterListIcon />
          </IconButton>
        </Grid>
        <Grid
          container
          item
          xs
          direction="column"
          style={{ width: "100%" }}
          alignItems="stretch"
          justify="center"
        >
          {applications.length > 0 ? (
            applications.map((obj) => (
              <Grid item key={obj._id}>
                <ApplicationTile application={obj} getData={getData} />
              </Grid>
            ))
          ) : (
            <Typography variant="h5" style={{ textAlign: "center" }}>
              No Applications Found
            </Typography>
          )}
        </Grid>
      </Grid>
      <FilterPopup
        open={filterOpen}
        searchOptions={searchOptions}
        setSearchOptions={setSearchOptions}
        handleClose={() => setFilterOpen(false)}
        getData={() => {
          getData();
          setFilterOpen(false);
        }}
      />
    </>
  );
};
export default AcceptedApplicants;
