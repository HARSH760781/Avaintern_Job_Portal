import React, { useState, useContext, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  InputAdornment,
  Chip,
  IconButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { Navigate } from "react-router-dom";
import DescriptionIcon from "@mui/icons-material/Description";
import FaceIcon from "@mui/icons-material/Face";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import { SetPopupContext } from "../App";

import apiList from "../../../frontend2/src/lib/apiList";
import isAuth from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  body: {
    padding: "60px 60px",
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(0),
      margin: "10px",
      padding: "10px", // Adjusted padding for small screens
    },
  },
  inputBox: {
    width: "400px", // Consistent width with other input fields
    [theme.breakpoints.down("sm")]: {
      width: "300px",
    },
  },
  submitButton: {
    width: "400px",
    [theme.breakpoints.down("md")]: {
      width: "200px",
      margin: "10px", // Adjusted padding for small screens
    },
  },
  fileUploadField: {
    width: "400px", // Make sure it aligns with other input fields
    marginBottom: theme.spacing(2),
    textAlign: "center", // Center the content of file input
    padding: theme.spacing(1), // Add padding for better spacing
    [theme.breakpoints.down("md")]: {
      width: "300px", // Adjusted padding for small screens
    },
  },
  uploadIcon: {
    color: theme.palette.primary.main,
  },
  fileInputWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: `1px solid ${theme.palette.grey[300]}`,
    padding: "12px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    width: "100%",
    "&:hover": {
      backgroundColor: theme.palette.grey[100],
      transform: "scale(1.05)", // Slight zoom effect on hover
    },
    "& input": {
      display: "none", // Hide the default file input element
    },
  },
  fileInputLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px", // Space between the icon and text
    fontWeight: "500",
    color: theme.palette.primary.main,
  },
  chipsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  chip: {
    margin: theme.spacing(0.5),
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },
  educationGrid: {
    marginBottom: theme.spacing(2), // Add spacing between education sections
  },
  educationInput: {
    width: "100%", // Ensure inputs take full width
  },
}));

// Custom File Upload Component
const FileUploadField = ({ label, value, onChange, accept, icon }) => {
  const classes = useStyles();

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      onChange(file); // Pass the file to the parent component
    }
  };

  return (
    <div className={classes.fileUploadField}>
      <TextField
        fullWidth
        label={label}
        value={value ? value.name : ""} // Display the file name
        variant="outlined"
        InputProps={{
          readOnly: true, // Make the input field read-only
          endAdornment: (
            <InputAdornment position="end">
              <div className={classes.fileInputWrapper}>
                <label className={classes.fileInputLabel}>
                  {icon} Upload
                  <input
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

const MultifieldInput = (props) => {
  const classes = useStyles();
  const { education, setEducation } = props;

  return (
    <>
      {education.map((obj, key) => (
        <Grid
          item
          container
          direction="column"
          spacing={2}
          key={key}
          style={{
            paddingLeft: 0,
            paddingRight: 0,
            width: "300px",
            margin: "auto",
          }}
        >
          {/* First Row: Institution Name */}
          <Grid item xs={12}>
            <TextField
              label={`Institution Name #${key + 1}`}
              value={education[key].institutionName}
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].institutionName = event.target.value;
                setEducation(newEdu);
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>

          {/* Second Row: Start Year and End Year */}
          <Grid item container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Start Year"
                value={obj.startYear}
                variant="outlined"
                type="number"
                onChange={(event) => {
                  const newEdu = [...education];
                  newEdu[key].startYear = event.target.value;
                  setEducation(newEdu);
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="End Year"
                value={obj.endYear}
                variant="outlined"
                type="number"
                onChange={(event) => {
                  const newEdu = [...education];
                  newEdu[key].endYear = event.target.value;
                  setEducation(newEdu);
                }}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
      ))}

      {/* Add Another Institution Button */}
      <Grid item>
        <Button
          variant="contained"
          color="secondary"
          onClick={() =>
            setEducation([
              ...education,
              {
                institutionName: "",
                startYear: "",
                endYear: "",
              },
            ])
          }
          fullWidth
        >
          Add another institution details
        </Button>
      </Grid>
    </>
  );
};

const Signup = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  // Check localStorage for token on component mount and set the logged-in state accordingly
  const [loggedin, setLoggedin] = useState(
    localStorage.getItem("token") ? true : false
  );

  const [signupDetails, setSignupDetails] = useState({
    type: "applicant",
    email: "",
    password: "",
    name: "",
    education: [],
    skills: [],
    resume: "",
    profile: "",
    bio: "",
    contactNumber: "",
  });

  const [phone, setPhone] = useState("");
  const [files, setFiles] = useState({
    resume: null,
    profileImage: null,
  });

  const [education, setEducation] = useState([
    {
      institutionName: "",
      startYear: "",
      endYear: "",
    },
  ]);

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    password: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    name: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    // bio: {
    //   untouched: true,
    //   required: true,
    //   error: false,
    //   message: "",
    // },
  });

  const [skillInput, setSkillInput] = useState(""); // State for the skill input field

  const handleInput = (key, value) => {
    setSignupDetails((prevDetails) => ({
      ...prevDetails,
      [key]: value,
    }));
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: {
        required: true,
        untouched: false,
        error: status,
        message: message,
      },
    });
  };

  const handleEducationChange = (key, field, value) => {
    setEducation((prevEducation) => {
      const updatedEducation = [...prevEducation];
      updatedEducation[key][field] = value;
      return updatedEducation;
    });
  };

  const handleSkillInputKeyDown = (event) => {
    if (event.key === "Enter" && skillInput.trim() !== "") {
      setSignupDetails((prevDetails) => ({
        ...prevDetails,
        skills: [...prevDetails.skills, skillInput.trim()],
      }));
      setSkillInput(""); // Clear the input field
    }
  };

  // Remove a skill when the cross icon is clicked
  const handleSkillDelete = (skillToDelete) => {
    setSignupDetails((prevDetails) => ({
      ...prevDetails,
      skills: prevDetails.skills.filter((skill) => skill !== skillToDelete),
    }));
  };

  const handleLogin = () => {
    // Clean the phone number
    if (phone.length !== 10) {
      setPopup({
        open: true,
        severity: "error",
        message: "Please provide a valid 10-digit phone number",
      });
      return; // Prevent form submission if invalid phone number
    }

    // Continue with the rest of the logic
    const tmpErrorHandler = {};
    Object.keys(inputErrorHandler).forEach((obj) => {
      if (inputErrorHandler[obj].required && inputErrorHandler[obj].untouched) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${obj[0].toUpperCase() + obj.substr(1)} is required`,
        };
      } else {
        tmpErrorHandler[obj] = inputErrorHandler[obj];
      }
    });

    // Validate the form
    const verified = !Object.keys(tmpErrorHandler).some((obj) => {
      return tmpErrorHandler[obj].error;
    });

    // console.log("Verified", verified);
    if (verified) {
      // Create a FormData object
      const formData = new FormData();

      // Append all form fields to FormData
      formData.append("type", signupDetails.type);
      formData.append("email", signupDetails.email);
      formData.append("password", signupDetails.password);
      formData.append("name", signupDetails.name);
      formData.append("education", JSON.stringify(education));
      formData.append("skills", JSON.stringify(signupDetails.skills));
      formData.append("bio", signupDetails.bio);
      formData.append("contactNumber", signupDetails.contactNumber);
      formData.append("mobilePhone", phone); // Append the cleaned phone number

      // Append files if they exist
      if (files.resume) {
        formData.append("resume", files.resume);
      }
      if (files.profileImage) {
        formData.append("profile", files.profileImage);
      }
      // Send the FormData to the backend
      // console.log(formData);

      axios
        .post(apiList.signup, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          localStorage.setItem("token", response.data.token); // Store token in localStorage
          localStorage.setItem("type", response.data.type); // Optionally store type
          setLoggedin(true); // Update the loggedin state
          setPopup({
            open: true,
            severity: "success",
            message: "Logged in successfully",
          });
        })
        .catch((err) => {
          setPopup({
            open: true,
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occurred",
          });
        });
    } else {
      setInputErrorHandler(tmpErrorHandler);
      setPopup({
        open: true,
        severity: "error",
        message: "Incorrect Input",
      });
    }
  };
  useEffect(() => {
    // Check if token exists in localStorage
    if (localStorage.getItem("token")) {
      setLoggedin(true); // Set loggedin state to true if a token exists
    }
  }, []);

  return loggedin ? (
    <Navigate to="/" replace />
  ) : (
    <Paper elevation={3} className={classes.body}>
      <Grid container direction="column" spacing={4} alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h2">
            Signup
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            select
            label="Category"
            variant="outlined"
            className={classes.inputBox}
            value={signupDetails.type}
            onChange={(event) => {
              handleInput("type", event.target.value);
            }}
          >
            <MenuItem value="applicant">Applicant</MenuItem>
            <MenuItem value="recruiter">Recruiter</MenuItem>
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            label="Name"
            value={signupDetails.name}
            onChange={(event) => handleInput("name", event.target.value)}
            className={classes.inputBox}
            error={inputErrorHandler.name.error}
            helperText={inputErrorHandler.name.message}
            onBlur={(event) => {
              if (event.target.value === "") {
                handleInputError("name", true, "Name is required");
              } else {
                handleInputError("name", false, "");
              }
            }}
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <TextField
            label="Email"
            value={signupDetails.email}
            onChange={(event) => handleInput("email", event.target.value)}
            className={classes.inputBox}
            error={inputErrorHandler.email.error}
            helperText={inputErrorHandler.email.message}
            onBlur={(event) => {
              if (event.target.value === "") {
                handleInputError("email", true, "Email is required");
              } else {
                handleInputError("email", false, "");
              }
            }}
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <PasswordInput
            label="Password"
            value={signupDetails.password}
            onChange={(event) => handleInput("password", event.target.value)}
            className={classes.inputBox}
            error={inputErrorHandler.password.error}
            helperText={inputErrorHandler.password.message}
            onBlur={(event) => {
              if (event.target.value === "") {
                handleInputError("password", true, "Password is required");
              } else {
                handleInputError("password", false, "");
              }
            }}
          />
        </Grid>
        {signupDetails.type === "applicant" ? (
          <>
            <MultifieldInput
              education={education}
              setEducation={setEducation}
            />
            <Grid item>
              <TextField
                className={classes.inputBox}
                label="Skills"
                variant="outlined"
                helperText="Type a skill and press Enter to add it"
                value={skillInput} // Controlled input value
                onChange={(event) => {
                  setSkillInput(event.target.value); // Update the skillInput state
                }}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    skillInput.trim() !== "" &&
                    signupDetails.skills.length < 3
                  ) {
                    setSignupDetails((prevDetails) => ({
                      ...prevDetails,
                      skills: [...prevDetails.skills, skillInput.trim()],
                    }));
                    setSkillInput(""); // Clear the input field after adding the skill
                  } else if (
                    event.key === "Enter" &&
                    signupDetails.skills.length >= 3
                  ) {
                    setPopup({
                      open: true,
                      severity: "error",
                      message: "You can only add a maximum of 3 skills.",
                    });
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        maxWidth: "100%", // Ensure chips don't overflow
                      }}
                    >
                      {signupDetails.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          onDelete={() => handleSkillDelete(skill)}
                          className={classes.chip}
                          sx={{
                            marginRight: 1, // Add spacing between chips
                            transition: "all 0.3s ease", // Smooth transition for hover and delete
                            "&:hover": {
                              transform: "scale(1.05)", // Slightly enlarge on hover
                            },
                          }}
                        />
                      ))}
                    </InputAdornment>
                  ),
                  placeholder: "e.g., JavaScript, React, Node.js",
                  sx: {
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap", // Allow chips to wrap to the next line
                    padding: "8px", // Add padding to the input field
                    minHeight: "50px", // Ensure the input box has enough height to show the skills
                    boxSizing: "border-box", // Ensure padding does not affect the overall size of the input box
                  },
                }}
                multiline // Allow the input field to expand vertically
                minRows={1} // Minimum number of rows
                maxRows={4} // Maximum number of rows (adjust as needed)
                sx={{
                  "& .MuiOutlinedInput-root": {
                    flexWrap: "wrap", // Allow chips to wrap inside the input field
                    alignItems: "flex-start", // Align chips to the top
                  },
                }}
              />
            </Grid>

            <Grid item>
              <FileUploadField
                label="Resume (.pdf)"
                value={files.resume}
                onChange={(file) => {
                  setFiles({ ...files, resume: file });
                }}
                style={{ backgroundColor: "Red" }}
                accept=".pdf"
                icon={<DescriptionIcon />}
              />
            </Grid>
            <Grid item>
              <FileUploadField
                label="Profile Image"
                value={files.profileImage}
                onChange={(file) => {
                  setFiles({ ...files, profileImage: file });
                }}
                accept="image/*"
                icon={<FaceIcon />}
              />
            </Grid>
          </>
        ) : (
          <Grid item>
            <TextField
              label="Bio"
              value={signupDetails.bio}
              onChange={(event) => handleInput("bio", event.target.value)}
              className={classes.inputBox}
              error={inputErrorHandler.name.error}
              helperText={inputErrorHandler.name.message}
              onBlur={(event) => {
                if (event.target.value === "") {
                  handleInputError("Bio", true, "Bio is required");
                } else {
                  handleInputError("Bio", false, "");
                }
              }}
              variant="outlined"
              multiline // Allow the input field to expand vertically
              minRows={1} // Minimum number of rows
              maxRows={4} // Maximum number of rows (adjust as needed)
            />
          </Grid>
        )}
        <Grid item>
          <TextField
            label="Phone Number"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={classes.inputBox}
            variant="outlined"
            placeholder="Enter your 10-digit phone number"
            inputProps={{
              maxLength: 10, // Limit input to 10 digits
            }}
          />
        </Grid>
        <Grid item>
          <Button
            className={classes.submitButton}
            variant="contained"
            onClick={handleLogin}
            color="primary"
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Signup;
