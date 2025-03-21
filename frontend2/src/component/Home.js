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
  CircularProgress,
  useMediaQuery,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Rating from "@mui/lab/Rating";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import { SetPopupContext } from "../App";
import apiList from "../../../frontend2/src/lib/apiList";
import { userType } from "../lib/isAuth";

import {
  Work as WorkIcon,
  AttachMoney as AttachMoneyIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Business as BusinessIcon,
  Code as CodeIcon,
  LocationCity,
} from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
    padding: theme.spacing(4),
    backgroundColor: "#f5f5f5", // Light background for the page
  },
  button: {
    width: "100%",
    height: "50px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease, transform 0.3s ease",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
      transform: "scale(1.05)",
    },
  },
  jobTileOuter: {
    padding: theme.spacing(2),
    margin: theme.spacing(2, 0),
    boxSizing: "border-box",
    width: "100%",
    borderRadius: "12px",
    backgroundColor: "#ffffff", // White background for cards
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: theme.shadows[8],
    },
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  filterPopup: {
    padding: theme.spacing(2),
    outline: "none",
    minWidth: "50%",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    [theme.breakpoints.down("sm")]: {
      minWidth: "90%",
    },
  },
  searchBar: {
    width: "100%",
    maxWidth: "500px",
    marginBottom: theme.spacing(2),
    backgroundColor: "#ffffff",
    borderRadius: "8px",
  },
  noJobsMessage: {
    textAlign: "center",
    marginTop: theme.spacing(4),
    color: theme.palette.text.secondary,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  chip: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    backgroundColor: theme.palette.primary.light,
    color: "#ffffff",
  },
  filterButton: {
    marginTop: theme.spacing(2),
    fontWeight: "bold",
    width: "50%",
    transition: "background-color 0.3s ease, transform 0.3s ease",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
      transform: "scale(1.05)",
    },
  },
}));

const JobTile = (props) => {
  const classes = useStyles();
  const { job } = props;
  const theme = useTheme();
  const setPopup = useContext(SetPopupContext);

  const [open, setOpen] = useState(false);
  const [sop, setSop] = useState("");

  const handleClose = () => {
    setOpen(false);
    setSop("");
  };

  const handleApply = () => {
    axios
      .post(
        `${apiList.jobs}/${job._id}/applications`,
        {
          sop: sop,
        },
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
          message: response.data.message,
        });
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

  const deadline = new Date(job.deadline).toLocaleDateString();

  return (
    <Paper className={classes.jobTileOuter} elevation={3}>
      <Grid container spacing={2}>
        {/* Left Section: Job Details */}
        <Grid item xs={12} md={9}>
          <Typography variant="h5" gutterBottom style={{ fontWeight: "bold" }}>
            {job.title}
          </Typography>
          <Typography
            variant="h6"
            gutterBottom
            style={{ fontWeight: "500", fontStyle: "normal", color: "blue" }}
          >
            <BusinessIcon fontSize="xs" style={{ marginRight: "8px" }} />
            {job.companyName}
          </Typography>
          <Rating value={job.rating !== -1 ? job.rating : null} readOnly />
          <Typography variant="body1" color="textSecondary">
            <WorkIcon fontSize="small" style={{ marginRight: "8px" }} />
            Role: {job.jobType}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <LocationCity fontSize="small" style={{ marginRight: "8px" }} />
            Location: {job.Location}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <ScheduleIcon fontSize="small" style={{ marginRight: "8px" }} />
            Duration:{" "}
            {job.duration !== 0 ? `${job.duration} months` : "Flexible"}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <PersonIcon fontSize="small" style={{ marginRight: "8px" }} />
            Posted By: {job.recruiter.name}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <EventIcon fontSize="small" style={{ marginRight: "8px" }} />
            Deadline: {deadline}
          </Typography>
          <Box mt={1}>
            <CodeIcon fontSize="small" style={{ marginRight: "8px" }} />
            {job.skillsets.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                className={classes.chip}
                size="small"
              />
            ))}
          </Box>
        </Grid>

        {/* Right Section: Apply Button */}
        <Grid
          item
          xs={12}
          md={3}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap={2}
        >
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
              window.open(job.careerPageLink, "_blank");
              setOpen(true);
            }}
            disabled={userType() === "recruiter"}
            fullWidth
          >
            Apply
          </Button>
          {/* {job.careerPageLink && (
            <Button
              variant="outlined"
              color="secondary"
              className={classes.button}
              onClick={() => window.open(job.careerPageLink, "_blank")}
              fullWidth
            >
              Visit Career Page
            </Button>
          )} */}
        </Grid>
      </Grid>

      {/* </Grid>s */}

      {/* Modal for SOP */}
      <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "50%",
            alignItems: "center",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
          }}
        >
          <TextField
            label="How do you fit for this role (up to 250 words)"
            multiline
            rows={8}
            style={{ width: "100%", marginBottom: "30px" }}
            variant="outlined"
            value={sop}
            onChange={(event) => {
              if (
                event.target.value.split(" ").filter((n) => n !== "").length <=
                250
              ) {
                setSop(event.target.value);
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ padding: "10px 50px" }}
            onClick={handleApply}
          >
            Submit
          </Button>
        </Paper>
      </Modal>
    </Paper>
  );
};
const FilterPopup = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const { open, handleClose, searchOptions, setSearchOptions, getData } = props;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
      <Paper
        className={classes.filterPopup}
        style={{
          maxHeight: "60vh", // Limit height to 90% of the viewport
          overflow: "auto", // Make content scrollable
          padding: theme.spacing(3),
          width: isMobile ? "90%" : "50%", // Responsive width
          margin: "auto", // Center the popup
          // padding: "24px !important",
        }}
      >
        <Grid
          container
          direction="column"
          alignItems="center"
          spacing={3}
          // style={{ width: "90% !important" }}
        >
          {/* Job Type Section */}
          <Grid container item alignItems="center">
            <Grid item xs={12} sm={3}>
              <Typography variant="body1">Job Type</Typography>
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
          <Grid container item alignItems="center">
            <Grid item xs={12} sm={3}>
              <Typography variant="body1">Location</Typography>
            </Grid>
            <Grid item xs={12} sm={9}>
              <Slider
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => value * 1000}
                marks={[
                  { value: 0, label: "0" },
                  { value: 100, label: "100000" },
                ]}
                value={searchOptions.Location}
                onChange={(event, value) =>
                  setSearchOptions({
                    ...searchOptions,
                    Location: value,
                  })
                }
              />
            </Grid>
          </Grid>

          {/* Duration Section */}
          <Grid container item alignItems="center">
            <Grid item xs={12} sm={3}>
              <Typography variant="body1">Duration</Typography>
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
          <Grid container item alignItems="center">
            <Grid item xs={12} sm={3}>
              <Typography variant="body1">Sort</Typography>
            </Grid>
            <Grid container item xs={12} sm={9} spacing={2}>
              {["Location", "duration", "rating"].map((field) => (
                <Grid item xs={12} sm={4} key={field}>
                  <Paper
                    style={{
                      padding: theme.spacing(1),
                      border: "1px solid #D1D1D1",
                      borderRadius: "5px",
                    }}
                  >
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>
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
                      </Grid>
                      <Grid item>
                        <Typography variant="body1">
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </Typography>
                      </Grid>
                      <Grid item>
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
                      </Grid>
                    </Grid>
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
              style={{ padding: "10px 50px", marginTop: theme.spacing(2) }}
              onClick={() => {
                getData();
                handleClose();
              }}
            >
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};

const Home = (props) => {
  const classes = useStyles();
  const [jobs, setJobs] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setLoading(true);
    let searchParams = [];
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
    if (searchOptions.Location[0] !== 0) {
      searchParams = [
        ...searchParams,
        `LocationMin=${searchOptions.Location[0] * 1000}`,
      ];
    }
    if (searchOptions.Location[1] !== 100) {
      searchParams = [
        ...searchParams,
        `LocationMax=${searchOptions.Location[1] * 1000}`,
      ];
    }
    if (searchOptions.duration !== "0") {
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
    let address = apiList.jobs;
    if (queryString !== "") {
      address = `${address}?${queryString}`;
    }

    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setJobs(
          response.data.filter((obj) => {
            const today = new Date();
            const deadline = new Date(obj.deadline);
            return deadline > today;
          })
        );
        setLoading(false);
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: "Error fetching jobs",
        });
        setLoading(false);
      });
  };

  return (
    <Grid container className={classes.body} spacing={3}>
      <Grid item xs={12}>
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          className={classes.sectionTitle}
        >
          Jobs
        </Typography>
      </Grid>
      <Grid container spacing={3} style={{ margin: "auto" }}>
        {/* Left Side: Search Menu */}
        <Grid
          item
          xs={12}
          md={3}
          style={{
            borderRight: isMobile ? "none" : "2px solid #ccc",
            paddingRight: isMobile ? 0 : theme.spacing(3),
          }}
        >
          <Box display="flex" flexDirection="column" gap={2}>
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
                    <IconButton onClick={getData}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
              variant="outlined"
              className={classes.searchBar}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<FilterListIcon />}
              onClick={() => setFilterOpen(true)}
              className={classes.filterButton}
              fullWidth
            >
              Filters
            </Button>
          </Box>
        </Grid>

        {/* Right Side: Job Listings */}
        <Grid item xs={12} md={9}>
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : jobs.length > 0 ? (
            jobs.map((job) => <JobTile key={job._id} job={job} />)
          ) : (
            <Typography variant="h5" className={classes.noJobsMessage}>
              No jobs found
            </Typography>
          )}
        </Grid>
      </Grid>

      {/* Filter Popup */}
      <FilterPopup
        open={filterOpen}
        searchOptions={searchOptions}
        setSearchOptions={setSearchOptions}
        handleClose={() => setFilterOpen(false)}
        getData={getData}
      />
    </Grid>
  );
};

export default Home;
