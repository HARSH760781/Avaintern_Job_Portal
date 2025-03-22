import { useContext, useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Paper,
  TextField,
  Box,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  useMediaQuery, // Added useMediaQuery import
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import apiList from "../../../frontend2/src/lib/apiList";
import { SetPopupContext } from "../App";
import { useTheme } from "@mui/material/styles";
import DescriptionIcon from "@mui/icons-material/Description";
import FaceIcon from "@mui/icons-material/Face";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
    margin: "5%",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    [theme.breakpoints.down("sm")]: {
      margin: "2%",
    },
  },
  profilePaper: {
    padding: theme.spacing(4),
    borderRadius: "16px",
    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)",
    margin: "0 auto",
    background: "#ffffff",
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
  },
  inputBox: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    width: "100%",
    marginBottom: theme.spacing(4),
    borderCollapse: "collapse",
    "& th, & td": {
      padding: theme.spacing(2),
      border: "1px solid #ddd",
      textAlign: "left",
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(1),
      },
    },
    "& th": {
      backgroundColor: theme.palette.primary.main,
      color: "#fff",
      fontWeight: "600",
    },
    "& tr:nth-child(even)": {
      backgroundColor: "#f9f9f9",
    },
  },
  updateButton: {
    marginTop: theme.spacing(2),
    padding: "10px 24px",
    fontSize: "14px",
    fontWeight: "bold",
    backgroundColor: "#4caf50",
    color: "#fff",
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "#388e3c",
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
    },
  },
  sectionTitle: {
    marginBottom: theme.spacing(3),
    fontWeight: "600",
    color: "#333",
    fontSize: "20px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "18px",
    },
  },
  previewSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(4),
    marginTop: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      gap: theme.spacing(2),
    },
  },
  previewCard: {
    padding: theme.spacing(3),
    borderRadius: "12px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "100%",
    background: "linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(0), // Adjusted padding for small screens
    },
  },
  previewImage: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    margin: "auto",
    objectFit: "cover",
    border: "4px solid #f5f5f5",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
    transition: "transform 0.3s ease-in-out",
    "&:hover": {
      transform: "scale(1.05)",
    },
    [theme.breakpoints.down("sm")]: {
      width: "120px",
      height: "120px",
    },
  },
  downloadButton: {
    marginTop: theme.spacing(2),
    backgroundColor: "#1976d2",
    color: "#fff",
    padding: "10px 24px",
    fontSize: "14px",
    fontWeight: "bold",
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "#1565c0",
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
    },
  },
  loader: {
    textAlign: "center",
    marginTop: theme.spacing(4),
  },
  educationContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  educationItem: {
    padding: theme.spacing(2),
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1),
    },
  },
  educationHeader: {
    fontWeight: "600",
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1),
  },
  educationField: {
    marginBottom: theme.spacing(1),
  },
}));

const Profile = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const setPopup = useContext(SetPopupContext);
  const [profileDetails, setProfileDetails] = useState({
    name: "",
    education: [],
    skills: [],
    resume: "",
    profile: "",
  });
  const [education, setEducation] = useState([
    {
      institutionName: "",
      startYear: "",
      endYear: "",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null); // Store selected profile image file
  const [resumeFile, setResumeFile] = useState(null); // Store selected resume file

  const handleInput = (key, value) => {
    setProfileDetails({
      ...profileDetails,
      [key]: value,
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setLoading(true);
    axios
      .get(apiList.user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setProfileDetails(response.data);
        if (response.data.education.length > 0) {
          setEducation(
            response.data.education.map((edu) => ({
              institutionName: edu.institutionName || "",
              startYear: edu.startYear || "",
              endYear: edu.endYear || "",
            }))
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: "Error fetching profile details",
        });
        setLoading(false);
      });
  };

  const handleUpdate = () => {
    // Create a FormData object to send both profile details and files
    const formData = new FormData();

    // Append profile details
    formData.append(
      "profileDetails",
      JSON.stringify({
        ...profileDetails,
        education: education
          .filter((obj) => obj.institutionName.trim() !== "")
          .map((obj) => {
            if (obj["endYear"] === "") {
              delete obj["endYear"];
            }
            return obj;
          }),
      })
    );

    // Append profile image if selected
    if (profileImage) {
      formData.append("profile", profileImage);
    }

    // Append resume file if selected
    if (resumeFile) {
      formData.append("resume", resumeFile);
    }

    // Send the request
    axios
      .put(apiList.user, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        // Update profileDetails with the new URLs returned from the server
        setProfileDetails((prevDetails) => ({
          ...prevDetails,
          profile: response.data.profile || prevDetails.profile, // Use new profile URL if available
          resume: response.data.resume || prevDetails.resume, // Use new resume URL if available
        }));
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        getData(); // Refresh profile data
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
      });
  };

  if (loading) {
    return (
      <Box className={classes.loader}>
        <CircularProgress />
        <Typography variant="h6">Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <Box className={classes.body}>
      <Paper className={classes.profilePaper}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          style={{ fontWeight: 600, color: "#333" }}
        >
          Profile
        </Typography>

        {/* Personal Information Table */}
        <Typography variant="h5" className={classes.sectionTitle}>
          Personal Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">Name</Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={profileDetails.name}
              onChange={(e) => handleInput("name", e.target.value)}
              className={classes.inputBox}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">Skills</Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={profileDetails.skills.join(", ")}
              onChange={(e) =>
                handleInput("skills", e.target.value.split(", "))
              }
              className={classes.inputBox}
            />
          </Grid>
        </Grid>

        {/* Education Table */}
        <Typography variant="h5" className={classes.sectionTitle}>
          Education
        </Typography>
        {isMobile ? (
          // Mobile-friendly layout for screens below 600px
          <Box className={classes.educationContainer}>
            {education.map((edu, index) => (
              <Box key={index} className={classes.educationItem}>
                <Typography variant="body1" className={classes.educationHeader}>
                  Institution Name
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={edu.institutionName}
                  onChange={(e) => {
                    const updatedEducation = [...education];
                    updatedEducation[index].institutionName = e.target.value;
                    setEducation(updatedEducation);
                  }}
                  className={classes.educationField}
                />
                <Typography variant="body1" className={classes.educationHeader}>
                  Start Year
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={edu.startYear}
                  onChange={(e) => {
                    const updatedEducation = [...education];
                    updatedEducation[index].startYear = e.target.value;
                    setEducation(updatedEducation);
                  }}
                  className={classes.educationField}
                />
                <Typography variant="body1" className={classes.educationHeader}>
                  End Year
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={edu.endYear}
                  onChange={(e) => {
                    const updatedEducation = [...education];
                    updatedEducation[index].endYear = e.target.value;
                    setEducation(updatedEducation);
                  }}
                  className={classes.educationField}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    const updatedEducation = education.filter(
                      (_, i) => i !== index
                    );
                    setEducation(updatedEducation);
                  }}
                >
                  Remove
                </Button>
              </Box>
            ))}
          </Box>
        ) : (
          // Table layout for screens above 600px
          <table className={classes.table}>
            <thead>
              <tr>
                <th>Institution Name</th>
                <th>Start Year</th>
                <th>End Year</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {education.map((edu, index) => (
                <tr key={index}>
                  <td>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={edu.institutionName}
                      onChange={(e) => {
                        const updatedEducation = [...education];
                        updatedEducation[index].institutionName =
                          e.target.value;
                        setEducation(updatedEducation);
                      }}
                      className={classes.inputBox}
                    />
                  </td>
                  <td>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={edu.startYear}
                      onChange={(e) => {
                        const updatedEducation = [...education];
                        updatedEducation[index].startYear = e.target.value;
                        setEducation(updatedEducation);
                      }}
                      className={classes.inputBox}
                    />
                  </td>
                  <td>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={edu.endYear}
                      onChange={(e) => {
                        const updatedEducation = [...education];
                        updatedEducation[index].endYear = e.target.value;
                        setEducation(updatedEducation);
                      }}
                      className={classes.inputBox}
                    />
                  </td>
                  <td>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        const updatedEducation = education.filter(
                          (_, i) => i !== index
                        );
                        setEducation(updatedEducation);
                      }}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            setEducation([
              ...education,
              { institutionName: "", startYear: "", endYear: "" },
            ])
          }
        >
          Add Education
        </Button>

        {/* Profile and Resume Upload Fields */}
        <Grid container spacing={2} style={{ marginTop: theme.spacing(4) }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">Profile Picture</Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfileImage(e.target.files[0])}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">Resume</Typography>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files[0])}
            />
          </Grid>
        </Grid>

        {/* Preview Section */}
        <Typography
          variant="h5"
          className={classes.sectionTitle}
          style={{ marginTop: theme.spacing(4) }}
        >
          Preview
        </Typography>
        <Grid container spacing={4} className={classes.previewSection}>
          {profileDetails.resume && (
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <Card className={classes.previewCard}>
                <CardHeader
                  title="Resume Preview"
                  avatar={<DescriptionIcon fontSize="large" color="primary" />}
                />
                <CardContent>
                  <Button
                    variant="contained"
                    className={classes.downloadButton}
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = `${process.env.REACT_APP_SERVER}${profileDetails.resume}`;
                      link.download = "resume.pdf";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    Download Resume
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )}
          {profileDetails.profile && (
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <Card className={classes.previewCard}>
                <CardHeader
                  title="Profile Image Preview"
                  avatar={<FaceIcon fontSize="large" color="primary" />}
                />
                <CardContent
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: theme.spacing(2),
                  }}
                >
                  console.log(
                  {`${process.env.REACT_APP_SERVER}${
                    profileDetails.profile
                  }?${new Date().getTime()}`}
                  );
                  <Avatar
                    src={`${process.env.REACT_APP_SERVER}${
                      profileDetails.profile
                    }?${new Date().getTime()}`} // Add a timestamp to force re-render
                    alt="Profile"
                    className={classes.previewImage}
                    style={{
                      width: "150px",
                      height: "150px",
                      [theme.breakpoints.down("sm")]: {
                        width: "120px",
                        height: "120px",
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        {/* Update Button */}
        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            variant="contained"
            className={classes.updateButton}
            onClick={handleUpdate}
          >
            Update Details
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
