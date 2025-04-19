import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import UserMenu from '../common/UserMenu';

const ProviderDocuments = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Business License',
      type: 'PDF',
      uploadDate: '2024-03-15',
      status: 'verified',
    },
    {
      id: 2,
      name: 'Insurance Certificate',
      type: 'PDF',
      uploadDate: '2024-03-14',
      status: 'pending',
    },
    {
      id: 3,
      name: 'Service Agreement',
      type: 'DOC',
      uploadDate: '2024-03-13',
      status: 'verified',
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentName, setDocumentName] = useState('');

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setDocumentName(file.name);
    }
  };

  const handleUpload = () => {
    if (selectedFile && documentName) {
      // TODO: Implement file upload logic
      const newDocument = {
        id: documents.length + 1,
        name: documentName,
        type: selectedFile.name.split('.').pop().toUpperCase(),
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'pending',
      };
      setDocuments([...documents, newDocument]);
      handleCloseDialog();
    }
  };

  const handleDelete = (documentId) => {
    // TODO: Implement delete logic
    setDocuments(documents.filter(doc => doc.id !== documentId));
  };

  const handleDownload = (document) => {
    // TODO: Implement download logic
    console.log('Downloading document:', document);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedFile(null);
    setDocumentName('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return '#2e7d32';
      case 'pending':
        return '#ed6c02';
      case 'rejected':
        return '#d32f2f';
      default:
        return '#757575';
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(/Background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <UserMenu userType="provider" />
      <Container maxWidth="lg" sx={{ pt: 10, pb: 5 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(10px)',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" className="washatdoor-text">
              Documents
            </Typography>
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onClick={() => setDialogOpen(true)}
              sx={{
                backgroundColor: '#2e7d32',
                '&:hover': {
                  backgroundColor: '#1b5e20',
                },
              }}
            >
              Upload Document
            </Button>
          </Box>

          <Grid container spacing={3}>
            {documents.map((document) => (
              <Grid item xs={12} key={document.id}>
                <Card 
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">
                        {document.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: getStatusColor(document.status),
                          textTransform: 'capitalize',
                        }}
                      >
                        {document.status}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                      Type: {document.type}
                    </Typography>
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                      Upload Date: {document.uploadDate}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload(document)}
                      sx={{ color: 'white' }}
                    >
                      Download
                    </Button>
                    <Button
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(document.id)}
                      sx={{ color: '#d32f2f' }}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      {/* Upload Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            color: 'white',
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h5" className="washatdoor-text">
            Upload Document
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Document Name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            />
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  borderColor: 'white',
                },
              }}
            >
              Choose File
              <input
                type="file"
                hidden
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx"
              />
            </Button>
            {selectedFile && (
              <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                Selected file: {selectedFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ color: 'white', borderColor: 'white' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!selectedFile || !documentName}
            sx={{
              backgroundColor: '#2e7d32',
              '&:hover': {
                backgroundColor: '#1b5e20',
              },
            }}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProviderDocuments; 