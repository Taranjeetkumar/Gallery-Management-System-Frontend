"use client";

import React, { useEffect } from 'react';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchArtworks, deleteArtwork } from '@/store/slices/artworksSlice';
import { Artwork } from '@/store/slices/artworksSlice';
import { useRouter } from 'next/navigation';
import { Box, Button, Card, CardContent, CardMedia, CircularProgress, Grid, IconButton, Typography, Alert } from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';

export default function ArtworkListPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector(state => state.auth);
  const { artworks, isLoading, error } = useAppSelector(state => state.artworks);


  console.log("gffsdyjugyjugjhv : ;  ",artworks);
  
  useEffect(() => {
    if (user?.id) {
      // Convert string ID to number for API call
      dispatch(fetchArtworks({ artistId: parseInt(user.id)  }));
    }
  }, [dispatch, user]);

  const handleDelete = async (id: number) => {
    if (confirm('Delete this artwork?')) {
      await dispatch(deleteArtwork(id));
      // Refresh the list after deletion
      if (user?.id) {
        dispatch(fetchArtworks({ filters: { artistId: parseInt(user.id) } }));
      }
    }
  };

  if (!user) {
    return (
      <ProtectedRoute>
        <Box p={2}>
          <Alert severity="error">User not found. Please log in again.</Alert>
        </Box>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Box p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">My Artworks</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push('/account/artworks/new')}
          >
            Create New Artwork
          </Button>
        </Box>

        {isLoading && (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        )}

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {!isLoading && artworks?.length === 0 && (
          <Alert severity="info">
            No artworks found. Create your first artwork to get started!
          </Alert>
        )}

        <Grid container spacing={3}>
          {artworks?.map((art: Artwork) => (
            <Grid item key={art.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {art.imageUrl && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={art.imageUrl}
                    alt={art.title}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>{art.title}</Typography>
                  {art.description && (
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {art.description.length > 100
                        ? `${art.description.substring(0, 100)}...`
                        : art.description}
                    </Typography>
                  )}
                  <Typography variant="body2">
                    <strong>Medium:</strong> {art.medium || 'Not specified'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Price:</strong> ${art.price || 'Not set'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong> {art.status || 'Unknown'}
                  </Typography>
                </CardContent>
                <Box p={1} display="flex" justifyContent="flex-end">
                  <IconButton
                    title="View"
                    onClick={() => router.push(`/artworks/${art.id}`)}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    title="Edit"
                    onClick={() => router.push(`/account/artworks/${art.id}/edit`)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    title="Delete"
                    onClick={() => handleDelete(art.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </ProtectedRoute>
  );
}
