import React from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const FileUploadField = ({ label, value, onChange, accept, icon }) => {
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      onChange(file); // Pass the file to the parent component
    }
  };

  return (
    <TextField
      fullWidth
      label={label}
      value={value ? value.name : ""} // Display the file name
      variant="outlined"
      InputProps={{
        readOnly: true, // Make the input field read-only
        endAdornment: (
          <InputAdornment position="end">
            <IconButton component="label">
              {icon} {/* Upload cloud icon */}
              <input
                type="file"
                accept={accept} // Specify accepted file types
                style={{ display: "none" }} // Hide the default file input
                onChange={handleFileChange}
              />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default FileUploadField;
