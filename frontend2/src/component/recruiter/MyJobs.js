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
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Pagination from "@mui/material/Pagination";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import { SetPopupContext } from "../../App";

import apiList from "../../../../frontend2/src/lib/apiList";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  button: {
    width: "100%",
    height: "100%",
  },
  jobTileOuter: {
    padding: "30px",
    margin: "20px 0",
    boxSizing: "border-box",
    width: "100%",
  },
  popupDialog: {
    height: "90%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statusBlock: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
  },
}));

const JobTile = (props) => {
  const classes = useStyles();
  let history = useNavigate();
  const { job, getData } = props;
  const setPopup = useContext(SetPopupContext);

  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [jobDetails, setJobDetails] = useState(job);

  const handleInput = (key, value) => {
    setJobDetails({
      ...jobDetails,
      [key]: value,
    });
  };

  const handleClick = (location) => {
    history(location);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleDelete = () => {
    axios
      .delete(`${apiList.jobs}/${job._id}`, {
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
        handleClose();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleClose();
      });
  };

  const handleJobUpdate = () => {
    axios
      .put(`${apiList.jobs}/${job._id}`, jobDetails, {
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
        handleCloseUpdate();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleCloseUpdate();
      });
  };

  const postedOn = new Date(job.dateOfPosting);

  return (
    <Paper className={classes.jobTileOuter} elevation={3}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8} md={9}>
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <Typography variant="h5">{job.title}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6">{job.companyName}</Typography>
            </Grid>
            <Grid item>
              <Rating value={job.rating !== -1 ? job.rating : null} readOnly />
            </Grid>
            <Grid item>Role : {job.jobType}</Grid>
            <Grid item>Location : {job.Location} </Grid>
            <Grid item>
              Duration :{" "}
              {job.duration !== 0 ? `${job.duration} month` : `Flexible`}
            </Grid>
            <Grid item>Date Of Posting: {postedOn.toLocaleDateString()}</Grid>
            <Grid item>Number of Applicants: {job.maxApplicants}</Grid>
            <Grid item>
              Remaining Number of Positions:{" "}
              {job.maxPositions - job.acceptedCandidates}
            </Grid>
            <Grid item>
              {job.skillsets.map((skill) => (
                <Chip
                  label={skill}
                  style={{
                    borderRadius: "10px",
                    marginRight: "2px",
                    margin: "2px",
                  }}
                  key={skill}
                />
              ))}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                className={classes.statusBlock}
                onClick={() => handleClick(`/job/applications/${job._id}`)}
                fullWidth
              >
                View Applications
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                className={classes.statusBlock}
                onClick={() => setOpenUpdate(true)}
                style={{
                  background: "#FC7A1E",
                  color: "#fff",
                }}
                fullWidth
              >
                Update Details
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                className={classes.statusBlock}
                onClick={() => setOpen(true)}
                fullWidth
              >
                Delete Job
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
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
          <Typography variant="h4" style={{ marginBottom: "10px" }}>
            Are you sure?
          </Typography>
          <Grid container justify="center" spacing={5}>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                style={{ padding: "10px 50px" }}
                onClick={() => handleDelete()}
              >
                Delete
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                style={{ padding: "10px 50px" }}
                onClick={() => handleClose()}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
      <Modal
        open={openUpdate}
        onClose={handleCloseUpdate}
        className={classes.popupDialog}
      >
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
          <Typography variant="h4" style={{ marginBottom: "10px" }}>
            Update Details
          </Typography>
          <Grid
            container
            direction="column"
            spacing={3}
            style={{ margin: "10px" }}
          >
            <Grid item>
              <TextField
                label="Application Deadline"
                type="datetime-local"
                value={jobDetails.deadline.substr(0, 16)}
                onChange={(event) => {
                  handleInput("deadline", event.target.value);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Maximum Number Of Applicants"
                type="number"
                variant="outlined"
                value={jobDetails.maxApplicants}
                onChange={(event) => {
                  handleInput("maxApplicants", event.target.value);
                }}
                InputProps={{ inputProps: { min: 1 } }}
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Positions Available"
                type="number"
                variant="outlined"
                value={jobDetails.maxPositions}
                onChange={(event) => {
                  handleInput("maxPositions", event.target.value);
                }}
                InputProps={{ inputProps: { min: 1 } }}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container justify="center" spacing={5}>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                style={{ padding: "10px 50px" }}
                onClick={() => handleJobUpdate()}
              >
                Update
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                style={{ padding: "10px 50px" }}
                onClick={() => handleCloseUpdate()}
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

const FilterPopup = (props) => {
  const classes = useStyles();
  const { open, handleClose, searchOptions, setSearchOptions, getData } = props;

  // State to track mobile mode
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Effect to update mobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
      <Paper
        style={{
          padding: isMobile ? "20px" : "20px", // Less padding on mobile
          outline: "none",
          minWidth: isMobile ? "90%" : "50%", // Wider on mobile, narrower on desktop
          maxWidth: isMobile ? "90%" : "500px", // Constrain width on desktop
          width: isMobile ? "90%" : "auto", // Full width on mobile
          margin: "auto", // Center the modal
          maxHeight: "90vh", // Ensure modal doesn't exceed screen height
          overflowY: "auto", // Enable vertical scrolling
        }}
      >
        <Grid container direction="column" alignItems="center" spacing={3}>
          {/* Job Type Section */}
          <Grid container item alignItems="center" spacing={2}>
            <Grid item xs={12} sm={3}>
              <Typography>Job Type</Typography>
            </Grid>
            <Grid container item xs={12} sm={9} spacing={2}>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="fullTime"
                      checked={searchOptions.jobType.fullTime}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Full Time"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="partTime"
                      checked={searchOptions.jobType.partTime}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Part Time"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="wfh"
                      checked={searchOptions.jobType.wfh}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Work From Home"
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Location Section */}
          <Grid container item alignItems="center" spacing={2}>
            <Grid item xs={12} sm={3}>
              <Typography>Location</Typography>
            </Grid>
            <Grid item xs={12} sm={9}>
              <Slider
                value={searchOptions.Location}
                onChange={(event, value) =>
                  setSearchOptions({
                    ...searchOptions,
                    Location: value,
                  })
                }
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => value * 1000}
                marks={[
                  { value: 0, label: "0" },
                  { value: 100, label: "100000" },
                ]}
                style={{ width: isMobile ? "90%" : "100%" }} // Adjust slider width for mobile
              />
            </Grid>
          </Grid>

          {/* Duration Section */}
          <Grid container item alignItems="center" spacing={2}>
            <Grid item xs={12} sm={3}>
              <Typography>Duration</Typography>
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                select
                label="Duration"
                variant="outlined"
                fullWidth
                value={searchOptions.duration}
                onChange={(event) =>
                  setSearchOptions({
                    ...searchOptions,
                    duration: event.target.value,
                  })
                }
              >
                <MenuItem value="0">All</MenuItem>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4</MenuItem>
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="6">6</MenuItem>
                <MenuItem value="7">7</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {/* Sort Section */}
          <Grid container item alignItems="center" spacing={2}>
            <Grid item xs={12} sm={3}>
              <Typography>Sort</Typography>
            </Grid>
            <Grid container item xs={12} sm={9} spacing={2}>
              {["Location", "duration", "rating"].map((field) => (
                <Grid item xs={12} sm={4} key={field}>
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
const MyJobs = (props) => {
  const [jobs, setJobs] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    query: "",
    jobType: {
      fullTime: false,
      partTime: false,
      wfh: false,
    },
    Location: [0, 100],
    duration: "0",
    sort: {
      Location: {
        status: false,
        desc: false,
      },
      duration: {
        status: false,
        desc: false,
      },
      rating: {
        status: false,
        desc: false,
      },
    },
  });

  const setPopup = useContext(SetPopupContext);
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    let searchParams = [`myjobs=1`];
    if (searchOptions.query !== "") {
      searchParams = [...searchParams, `q=${searchOptions.query}`];
    }
    if (searchOptions.jobType.fullTime) {
      searchParams = [...searchParams, `jobType=Full%20Time`];
    }
    if (searchOptions.jobType.partTime) {
      searchParams = [...searchParams, `jobType=Part%20Time`];
    }
    if (searchOptions.jobType.wfh) {
      searchParams = [...searchParams, `jobType=Work%20From%20Home`];
    }
    if (searchOptions.Location[0] != 0) {
      searchParams = [
        ...searchParams,
        `LocationMin=${searchOptions.Location[0] * 1000}`,
      ];
    }
    if (searchOptions.Location[1] != 100) {
      searchParams = [
        ...searchParams,
        `LocationMax=${searchOptions.Location[1] * 1000}`,
      ];
    }
    if (searchOptions.duration != "0") {
      searchParams = [...searchParams, `duration=${searchOptions.duration}`];
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
    console.log(queryString);
    let address = apiList.jobs;
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
        setJobs(response.data);
      })
      .catch((err) => {
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
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
        {/* Responsive Title Section */}
        <Grid
          item
          container
          direction="column"
          alignItems="center"
          spacing={2}
          style={{ marginBottom: "20px" }}
        >
          <Grid item>
            <Typography
              variant="h2"
              style={{ fontSize: "2rem", textAlign: "center" }}
            >
              My Jobs
            </Typography>
          </Grid>
          <Grid item container justifyContent="center" spacing={2}>
            <Grid item xs={12} sm={8} md={6}>
              <TextField
                label="Search Jobs"
                value={searchOptions.query}
                onChange={(event) =>
                  setSearchOptions({
                    ...searchOptions,
                    query: event.target.value,
                  })
                }
                onKeyPress={(ev) => {
                  if (ev.key === "Enter") {
                    getData();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <IconButton onClick={() => getData()}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <IconButton onClick={() => setFilterOpen(true)}>
                <FilterListIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>

        {/* Job List Section */}
        <Grid
          container
          item
          xs
          direction="column"
          alignItems="stretch"
          justify="center"
        >
          {jobs.length > 0 ? (
            jobs.map((job) => {
              return <JobTile job={job} getData={getData} key={job._id} />;
            })
          ) : (
            <Typography variant="h5" style={{ textAlign: "center" }}>
              No jobs found
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

export default MyJobs;
