import React, { useState } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useLocation , useParams } from "react-router-dom";

const UpdateDNSRecord = ({ initialRecordType, initialRecordValue, onSubmit, onClose }) => {
  // const [domainName, setDomainName] = useState(initialDomainName);
  const [recordType, setRecordType] = useState(initialRecordType);
  const [recordValue, setRecordValue] = useState(initialRecordValue);
  const [ttl, setTTL] = useState("3600"); // TTL state
  const location = useLocation();
  const { title } = location.state || {};
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");


 // Function to handle changes in record type
// Function to handle changes in record type
const handleRecordTypeChange = (event) => {
    const selectedType = event.target.value;
    setRecordType(selectedType);
    // Set record value and TTL based on record type
    switch (selectedType) {
      case "A":
        setRecordValue("192.0.2.1");
        setTTL("3600");
        break;
      case "AAAA":
        setRecordValue("2001:0db8:85a3:0000:0000:8a2e:0370:7334");
        setTTL("3600");
        break;
      case "CNAME":
        setRecordValue("example.com");
        setTTL("3600");
        break;
      case "MX":
        setRecordValue("10 mail.example.com");
        setTTL("3600");
        break;
      case "NS":
        setRecordValue("ns1.example.com");
        setTTL("3600");
        break;
      case "PTR":
        setRecordValue("example.com");
        setTTL("3600");
        break;
      case "SOA":
        setRecordValue("ns1.example.com hostmaster.example.com 2022032801 7200 3600 1209600 3600");
        setTTL("3600");
        break;
      case "SRV":
        setRecordValue("0 5 5269 xmpp-server.example.com");
        setTTL("3600");
        break;
      case "TXT":
        setRecordValue("sample text");
        setTTL("3600");
        break;
      case "DNSSEC":
        setRecordValue("true");
        setTTL("3600");
        break;
      default:
        setRecordValue("");
        setTTL("3600");
    }
  };
  
  

  const handleSubmit = () => {
    const updatedDNSRecord = {
      Name : title,
      Type : recordType,
      Value : recordValue,
      ttl, 
    };

    onSubmit(updatedDNSRecord);
  };

  return (
    <Popover
      open={true} // Assuming this component is always open when called
      onClose={onClose}
      anchorOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
    >
      <Box sx={{ p: 4 }}>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" gutterBottom>
          Update DNS Record
        </Typography>
        <Typography variant="body1" gutterBottom>
          Domain Name
        </Typography>
        <TextField
          fullWidth
          id="domain-name"
          value={title}
          // onChange={(e) => setDomainName(e.target.value)}
          disabled
        />
        <Typography variant="body1" gutterBottom>
          Record Type
        </Typography>
        <FormControl fullWidth>
          <Select
            labelId="record-type-label"
            id="record-type"
            value={recordType}
            onChange={handleRecordTypeChange} // Call handleRecordTypeChange on change
          >
           <MenuItem value="A">A (Address)</MenuItem>
          <MenuItem value="AAAA">AAAA (IPv6 Address)</MenuItem>
          <MenuItem value="CNAME">CNAME (Canonical Name)</MenuItem>
          <MenuItem value="MX">MX (Mail Exchange) Record</MenuItem>
          <MenuItem value="NS">NS (Name Server) Record</MenuItem>
          <MenuItem value="PTR">PTR (Pointer) Record</MenuItem>
          <MenuItem value="SOA">SOA (Start of Authority) Record</MenuItem>
          <MenuItem value="SRV">SRV (Service) Record</MenuItem>
          <MenuItem value="TXT">TXT (Text) Record</MenuItem>
        <MenuItem value="DNSSEC">DNSSEC</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="body1" gutterBottom>
          Record Value
        </Typography>
        <TextField
          fullWidth
          id="record-value"
          value={recordValue}
          onChange={(e) => setRecordValue(e.target.value)}
        />
        <Typography variant="body1" gutterBottom>
          TTL
        </Typography>
        <TextField
          fullWidth
          id="record-ttl"
          value={ttl}
          disabled
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          style={{ backgroundColor: '#8A2BE2', color: 'white' }}
        >
          Update DNS Record
        </Button>

      </Box>
    </Popover>
  );
};

export default UpdateDNSRecord;
