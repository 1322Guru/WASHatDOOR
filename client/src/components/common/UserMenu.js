import React, { useState, useContext } from 'react';
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Box,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentIcon from '@mui/icons-material/Payment';
import HelpIcon from '@mui/icons-material/Help';
import HistoryIcon from '@mui/icons-material/History';
import StarIcon from '@mui/icons-material/Star';
import EventIcon from '@mui/icons-material/Event';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import BugReportIcon from '@mui/icons-material/BugReport';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth/authContext';

const UserMenu = ({ userType, onAIChatbotClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { logout } = authContext || {};
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    handleClose();
    navigate(path);
  };

  const handleLogout = () => {
    handleClose();
    if (logout) {
      logout();
    }
    navigate('/');
  };

  const handleAIChatbotClick = () => {
    handleClose();
    if (onAIChatbotClick) {
      onAIChatbotClick();
    }
  };

  return (
    <Box>
      <IconButton
        size="large"
        edge="end"
        color="inherit"
        aria-label="menu"
        onClick={handleMenuClick}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleMenuItemClick('/manage-profile')}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Manage Profile
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('/ratings')}>
          <ListItemIcon>
            <StarIcon fontSize="small" />
          </ListItemIcon>
          Ratings
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('/appointments')}>
          <ListItemIcon>
            <EventIcon fontSize="small" />
          </ListItemIcon>
          Appointments
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('/documents')}>
          <ListItemIcon>
            <DescriptionIcon fontSize="small" />
          </ListItemIcon>
          Documents
        </MenuItem>
        <MenuItem onClick={handleAIChatbotClick}>
          <ListItemIcon>
            <SmartToyIcon fontSize="small" />
          </ListItemIcon>
          AI Assistant
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserMenu; 