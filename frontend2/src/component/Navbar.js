import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";

import isAuth, { userType } from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: "auto", // Push the menu button to the right
  },
  title: {
    flexGrow: 1,
  },
  drawer: {
    width: 250,
  },
  toolbar: {
    paddingLeft: theme.spacing(2), // Add padding to the left of the toolbar
    paddingRight: theme.spacing(2), // Add padding to the right of the toolbar
    display: "flex", // Ensure flex layout
    alignItems: "center", // Center items vertically
  },
}));

const Navbar = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if screen size is below 600px
  const [drawerOpen, setDrawerOpen] = useState(false); // State to manage drawer open/close

  const handleClick = (location) => {
    console.log(location);
    navigate(location);
    setDrawerOpen(false); // Close the drawer after navigation
  };

  const renderButtons = () => {
    if (isAuth()) {
      return userType() === "recruiter" ? (
        <>
          <Button color="inherit" onClick={() => handleClick("/home")}>
            Home
          </Button>
          <Button color="inherit" onClick={() => handleClick("/addjob")}>
            Add Jobs
          </Button>
          <Button color="inherit" onClick={() => handleClick("/myjobs")}>
            My Jobs
          </Button>
          <Button color="inherit" onClick={() => handleClick("/employees")}>
            Employees
          </Button>
          <Button color="inherit" onClick={() => handleClick("/profile")}>
            Profile
          </Button>
          <Button color="inherit" onClick={() => handleClick("/logout")}>
            Logout
          </Button>
        </>
      ) : (
        <>
          <Button color="inherit" onClick={() => handleClick("/home")}>
            Home
          </Button>
          <Button color="inherit" onClick={() => handleClick("/applications")}>
            Applications
          </Button>
          <Button color="inherit" onClick={() => handleClick("/profile")}>
            Profile
          </Button>
          <Button color="inherit" onClick={() => handleClick("/logout")}>
            Logout
          </Button>
        </>
      );
    } else {
      return (
        <>
          <Button color="inherit" onClick={() => handleClick("/login")}>
            Login
          </Button>
          <Button color="inherit" onClick={() => handleClick("/signup")}>
            Signup
          </Button>
        </>
      );
    }
  };

  const renderDrawer = () => (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      <div className={classes.drawer}>
        <List>
          {isAuth() ? (
            userType() === "recruiter" ? (
              <>
                <ListItem button onClick={() => handleClick("/home")}>
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem button onClick={() => handleClick("/addjob")}>
                  <ListItemText primary="Add Jobs" />
                </ListItem>
                <ListItem button onClick={() => handleClick("/myjobs")}>
                  <ListItemText primary="My Jobs" />
                </ListItem>
                <ListItem button onClick={() => handleClick("/employees")}>
                  <ListItemText primary="Employees" />
                </ListItem>
                <ListItem button onClick={() => handleClick("/profile")}>
                  <ListItemText primary="Profile" />
                </ListItem>
                <ListItem button onClick={() => handleClick("/logout")}>
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button onClick={() => handleClick("/home")}>
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem button onClick={() => handleClick("/applications")}>
                  <ListItemText primary="Applications" />
                </ListItem>
                <ListItem button onClick={() => handleClick("/profile")}>
                  <ListItemText primary="Profile" />
                </ListItem>
                <ListItem button onClick={() => handleClick("/logout")}>
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            )
          ) : (
            <>
              <ListItem button onClick={() => handleClick("/login")}>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem button onClick={() => handleClick("/signup")}>
                <ListItemText primary="Signup" />
              </ListItem>
            </>
          )}
        </List>
      </div>
    </Drawer>
  );

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.title}>
            <ListItem button onClick={() => handleClick("/home")}>
              <ListItemText primary="Job portal" />
            </ListItem>
          </Typography>
          {!isMobile && renderButtons()}
          {isMobile && (
            <IconButton
              edge="end"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      {renderDrawer()}
    </div>
  );
};

export default Navbar;
