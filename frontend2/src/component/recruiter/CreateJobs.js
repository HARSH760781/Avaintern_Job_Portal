import { useContext, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Chip,
} from "@mui/material";
import { makeStyles } from "@mui/styles"; // Import makeStyles
import axios from "axios";

import { SetPopupContext } from "../../App";
import apiList from "../../../../frontend2/src/lib/apiList";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const CreateJobs = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [jobDetails, setJobDetails] = useState({
    title: "",
    maxApplicants: 100,
    maxPositions: 30,
    deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16), // Use slice instead of substr
    skillsets: [],
    jobType: "Full Time",
    duration: 0,
    salary: 0,
  });

  const handleInput = (key, value) => {
    setJobDetails({
      ...jobDetails,
      [key]: value,
    });
  };

  const handleUpdate = () => {
    console.log(jobDetails);
    axios
      .post(apiList.jobs, jobDetails, {
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
        setJobDetails({
          title: "",
          maxApplicants: 100,
          maxPositions: 30,
          deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 16), // Use slice instead of substr
          skillsets: [],
          jobType: "Full Time",
          duration: 0,
          salary: 0,
        });
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

  const [skillInput, setSkillInput] = useState("");
  const handleSkillAdd = (skill) => {
    if (skill && !jobDetails.skillsets.includes(skill)) {
      setJobDetails({
        ...jobDetails,
        skillsets: [...jobDetails.skillsets, skill],
      });
    }
  };
  const handleSkillDelete = (skill, index) => {
    const skillsets = jobDetails.skillsets.filter((_, i) => i !== index);
    setJobDetails({
      ...jobDetails,
      skillsets,
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
          <Typography variant="h2">Add Job</Typography>
        </Grid>
        <Grid item container xs direction="column" justifyContent="center">
          <Grid item>
            <Paper
              style={{
                padding: "20px",
                outline: "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid
                container
                direction="column"
                alignItems="stretch"
                spacing={3}
              >
                <Grid item>
                  <TextField
                    label="Title"
                    value={jobDetails.title}
                    onChange={(event) =>
                      handleInput("title", event.target.value)
                    }
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Skills"
                    variant="outlined"
                    helperText="Press enter to add skills"
                    value={skillInput} // Controlled input value
                    onChange={(event) => {
                      const input = event.target.value;
                      setSkillInput(input);

                      // Add skills when a comma is entered
                      if (input.includes(",")) {
                        const skills = input
                          .split(",")
                          .map((skill) => skill.trim())
                          .filter((skill) => skill); // Remove empty strings
                        skills.forEach((skill) => handleSkillAdd(skill));
                        setSkillInput(""); // Clear the input field
                      }
                    }}
                    onKeyPress={(event) => {
                      if (event.key === "Enter" && skillInput.trim()) {
                        handleSkillAdd(skillInput.trim()); // Add the skill
                        setSkillInput(""); // Clear the input field
                      }
                    }}
                    fullWidth
                  />
                  <div style={{ marginTop: "10px" }}>
                    {jobDetails.skillsets.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        onDelete={() => handleSkillDelete(skill, index)}
                        style={{ margin: "4px" }}
                      />
                    ))}
                  </div>
                </Grid>
                <Grid item>
                  <TextField
                    select
                    label="Job Type"
                    variant="outlined"
                    value={jobDetails.jobType}
                    onChange={(event) => {
                      handleInput("jobType", event.target.value);
                    }}
                    fullWidth
                  >
                    <MenuItem value="Full Time">Full Time</MenuItem>
                    <MenuItem value="Part Time">Part Time</MenuItem>
                    <MenuItem value="Work From Home">Work From Home</MenuItem>
                  </TextField>
                </Grid>
                <Grid item>
                  <TextField
                    select
                    label="Duration"
                    variant="outlined"
                    value={jobDetails.duration}
                    onChange={(event) => {
                      handleInput("duration", event.target.value);
                    }}
                    fullWidth
                  >
                    <MenuItem value={0}>Flexible</MenuItem>
                    <MenuItem value={1}>1 Month</MenuItem>
                    <MenuItem value={2}>2 Months</MenuItem>
                    <MenuItem value={3}>3 Months</MenuItem>
                    <MenuItem value={4}>4 Months</MenuItem>
                    <MenuItem value={5}>5 Months</MenuItem>
                    <MenuItem value={6}>6 Months</MenuItem>
                  </TextField>
                </Grid>
                <Grid item>
                  <TextField
                    label="Salary"
                    type="number"
                    variant="outlined"
                    value={jobDetails.salary}
                    onChange={(event) => {
                      handleInput("salary", event.target.value);
                    }}
                    InputProps={{ inputProps: { min: 0 } }}
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Application Deadline"
                    type="datetime-local"
                    value={jobDetails.deadline}
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
              <Button
                variant="contained"
                color="primary"
                style={{ padding: "10px 50px", marginTop: "30px" }}
                onClick={() => handleUpdate()}
              >
                Create Job
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default CreateJobs;
