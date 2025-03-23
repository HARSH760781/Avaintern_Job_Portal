import { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  Box,
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
  Rating, // Updated import
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useParams } from "react-router-dom";
import axios from "axios";
import FilterListIcon from "@mui/icons-material/FilterList"; // Updated import
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"; // Updated import
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"; // Updated import

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
  },
  jobTileOuter: {
    padding: "30px",
    margin: "20px auto",
    boxSizing: "border-box",
    width: "50%",
    [theme.breakpoints.down("sm")]: {
      width: "100%", // Adjusted padding for small screens
    },
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
          {/* Application Status Section */}
          <Grid container item alignItems="center" spacing={2}>
            <Grid item xs={12} sm={3}>
              <Typography>Application Status</Typography>
            </Grid>
            <Grid
              container
              item
              xs={12}
              sm={9}
              spacing={2}
              justifyContent={{ xs: "center", sm: "space-around" }} // Center on mobile, space around on desktop
            >
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="rejected"
                      checked={searchOptions.status.rejected}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          status: {
                            ...searchOptions.status,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Rejected"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="applied"
                      checked={searchOptions.status.applied}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          status: {
                            ...searchOptions.status,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Applied"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="shortlisted"
                      checked={searchOptions.status.shortlisted}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          status: {
                            ...searchOptions.status,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Shortlisted"
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Sort Section */}
          <Grid container item alignItems="center" spacing={2}>
            <Grid item xs={12} sm={3}>
              <Typography>Sort</Typography>
            </Grid>
            <Grid container item xs={12} sm={9} spacing={2}>
              {["name", "dateOfApplication", "rating"].map((field) => (
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

  const appliedOn = new Date(application.dateOfApplication);

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

  const getResume = () => {
    if (
      application.jobApplicant.resume &&
      application.jobApplicant.resume !== ""
    ) {
      const address = `${server}${application.jobApplicant.resume}`;
      // console.log(address);
      axios(address, {
        method: "GET",
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token
        },
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
        getData();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        console.log(err.response);
      });
  };

  const buttonSet = {
    applied: (
      <>
        <Grid item xs>
          <Button
            className={classes.statusBlock}
            style={{
              background: colorSet["shortlisted"],
              color: "#ffffff",
            }}
            onClick={() => updateStatus("shortlisted")}
          >
            Shortlist
          </Button>
        </Grid>
        <Grid item xs>
          <Button
            className={classes.statusBlock}
            style={{
              background: colorSet["rejected"],
              color: "#ffffff",
            }}
            onClick={() => updateStatus("rejected")}
          >
            Reject
          </Button>
        </Grid>
      </>
    ),
    shortlisted: (
      <>
        <Grid item xs>
          <Button
            className={classes.statusBlock}
            style={{
              background: colorSet["accepted"],
              color: "#ffffff",
            }}
            onClick={() => updateStatus("accepted")}
          >
            Accept
          </Button>
        </Grid>
        <Grid item xs>
          <Button
            className={classes.statusBlock}
            style={{
              background: colorSet["rejected"],
              color: "#ffffff",
            }}
            onClick={() => updateStatus("rejected")}
          >
            Reject
          </Button>
        </Grid>
      </>
    ),
    rejected: (
      <>
        <Grid item xs>
          <Paper
            className={classes.statusBlock}
            style={{
              background: colorSet["rejected"],
              color: "#ffffff",
            }}
          >
            Rejected
          </Paper>
        </Grid>
      </>
    ),
    accepted: (
      <>
        <Grid item xs>
          <Paper
            className={classes.statusBlock}
            style={{
              background: colorSet["accepted"],
              color: "#ffffff",
              padding: "5px",
              width: "auto",
            }}
          >
            Accepted
          </Paper>
        </Grid>
      </>
    ),
    cancelled: (
      <>
        <Grid item xs>
          <Paper
            className={classes.statusBlock}
            style={{
              background: colorSet["cancelled"],
              color: "#ffffff",
            }}
          >
            Cancelled
          </Paper>
        </Grid>
      </>
    ),
    finished: (
      <>
        <Grid item xs>
          <Paper
            className={classes.statusBlock}
            style={{
              background: colorSet["finished"],
              color: "#ffffff",
            }}
          >
            Finished
          </Paper>
        </Grid>
      </>
    ),
  };

  return (
    <Paper className={classes.jobTileOuter} elevation={3}>
      <Grid container spacing={2}>
        {/* Left Section: Applicant Details */}
        <Grid
          item
          xs={12}
          md={8}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Profile Image */}
          <Grid item xs={12} sm={3} md={2}>
            <Avatar
              src={`${server}${application.jobApplicant.profile}`} // Load profile image from server
              className={classes.avatar}
              style={{ width: "80px", height: "80px" }} // Adjust size as needed
            />
          </Grid>

          <Typography variant="h5">{application.jobApplicant.name}</Typography>
          <Rating
            value={
              application.jobApplicant.rating !== -1
                ? application.jobApplicant.rating
                : null
            }
            readOnly
          />
          <Typography>Applied On: {appliedOn.toLocaleDateString()}</Typography>
          <Typography>
            Education:{" "}
            {application.jobApplicant.education
              .map((edu) => {
                return `${edu.institutionName} (${edu.startYear}-${
                  edu.endYear ? edu.endYear : "Ongoing"
                })`;
              })
              .join(", ")}
          </Typography>
          <Typography>
            SOP: {application.sop !== "" ? application.sop : "Not Submitted"}
          </Typography>
          <Box mt={1}>
            {application.jobApplicant.skills.map((skill, index) => (
              <Chip label={skill} key={index} style={{ marginRight: "2px" }} />
            ))}
          </Box>
        </Grid>

        {/* Right Section: Buttons and Status */}
        <Grid
          item
          container
          direction="column"
          xs={12}
          md={4}
          spacing={2}
          alignItems={{ xs: "center", md: "flex-end" }} // Center on mobile, align right on desktop
        >
          <Grid item>
            <Button
              variant="contained"
              className={classes.statusBlock}
              color="primary"
              onClick={() => getResume()}
              fullWidth
            >
              Download Resume
            </Button>
          </Grid>
          <Grid item container spacing={1}>
            {buttonSet[application.status]}
          </Grid>
        </Grid>
      </Grid>

      {/* Modal for Additional Actions */}
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
          }}
        >
          <Button
            variant="contained"
            color="primary"
            style={{ padding: "10px 50px" }}
          >
            Submit
          </Button>
        </Paper>
      </Modal>
    </Paper>
  );
};

const JobApplications = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);
  const { jobId } = useParams();
  const [filterOpen, setFilterOpen] = useState(false);
  // const [searchOptions, setSearchOptions] = useState({
  //   status: {
  //     all: false,
  //     applied: false,
  //     shortlisted: false,
  //   },
  //   sort: {
  //     "jobApplicant.name": {
  //       status: false,
  //       desc: false,
  //     },
  //     dateOfApplication: {
  //       status: true,
  //       desc: true,
  //     },
  //     "jobApplicant.rating": {
  //       status: false,
  //       desc: false,
  //     },
  //   },
  // });

  const [searchOptions, setSearchOptions] = useState({
    status: {
      all: false,
      applied: false,
      shortlisted: false,
      rejected: false, // Add this if not already present
    },
    sort: {
      name: {
        status: false,
        desc: false,
      },
      dateOfApplication: {
        status: true, // Default sorting by date
        desc: true, // Default descending order
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

    if (searchOptions.status.rejected) {
      searchParams = [...searchParams, `status=rejected`];
    }
    if (searchOptions.status.applied) {
      searchParams = [...searchParams, `status=applied`];
    }
    if (searchOptions.status.shortlisted) {
      searchParams = [...searchParams, `status=shortlisted`];
    }

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
    // console.log(queryString);
    let address = `${apiList.applicants}?jobId=${jobId}`;
    if (queryString !== "") {
      address = `${address}&${queryString}`;
    }

    // console.log(address);

    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        // console.log(response.data);
        setApplications(response.data);
      })
      .catch((err) => {
        console.log(err.response);
        // console.log(err.response.data);
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
        style={{
          padding: "30px",
          minHeight: "93vh",
        }}
      >
        <Grid item>
          <Typography
            variant="h3"
            style={{
              fontSize: "25px !important",
            }}
          >
            Applications
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
          justifyContent="center" // Updated prop
        >
          {applications.length > 0 ? (
            applications.map((obj) => (
              <Grid item key={obj._id}>
                {/* {console.log(obj)} */}
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

export default JobApplications;
