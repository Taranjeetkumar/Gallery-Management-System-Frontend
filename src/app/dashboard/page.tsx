"use client";

import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { createGallery, fetchGalleries } from "@/store/slices/gallerySlice";
import { fetchArtworks } from "@/store/slices/artworksSlice";
import { UserRole } from "@/types/auth";
import type { Artwork, CreateGalleryData, Gallery } from "@/types/gallery";
import {
  Add,
  Delete,
  Edit,
  GridView,
  Image,
  MoreVert,
  People,
  PhotoLibrary,
  Search,
  TrendingUp,
  ViewList,
  Visibility,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  change,
}) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box>
          <Typography color="text.secondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div" fontWeight="bold">
            {value}
          </Typography>
          {change && (
            <Box display="flex" alignItems="center" mt={1}>
              <TrendingUp
                sx={{ fontSize: 16, mr: 0.5, color: "success.main" }}
              />
              <Typography variant="body2" color="success.main">
                {change}
              </Typography>
            </Box>
          )}
        </Box>
        <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>{icon}</Avatar>
      </Box>
    </CardContent>
  </Card>
);

interface RecentItemProps {
  title: string;
  subtitle: string;
  image?: string;
  status?: string;
  onView: () => void;
  onEdit: () => void;
}

const RecentItem: React.FC<RecentItemProps> = ({
  title,
  subtitle,
  image,
  status,
  onView,
  onEdit,
}) => (
  <Paper sx={{ p: 2, mb: 2 }}>
    <Box display="flex" alignItems="center" gap={2}>
      <Avatar
        src={image}
        sx={{ width: 48, height: 48, bgcolor: "primary.light" }}
      >
        <Image />
      </Avatar>
      <Box flex={1}>
        <Typography variant="subtitle1" fontWeight="medium">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
      {status && (
        <Chip
          label={status}
          size="small"
          color={status === "Published" ? "success" : "default"}
        />
      )}
      <Box>
        <IconButton size="small" onClick={onView}>
          <Visibility />
        </IconButton>
        <IconButton size="small" onClick={onEdit}>
          <Edit />
        </IconButton>
        <IconButton size="small">
          <MoreVert />
        </IconButton>
      </Box>
    </Box>
  </Paper>
);

export default function DashboardPage() {
  const { user, role } = useAppSelector((state) => state.auth);
  const { galleries, isLoading, error } = useAppSelector(
    (state) => state.gallery
  );
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { artworks } = useAppSelector((state) => state.artworks);
  const dispatch = useAppDispatch();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newGallery, setNewGallery] = useState<CreateGalleryData>({
    name: "",
    description: "",
    isPublic: true,
  });

  console.log("rolevvV:V::Vvdvv ", role);

  useEffect(() => {
    if (user) {
      console.log("jgfyjgyjuf", user);

      let role = user.roles[0];
      console.log("gfgyugyufgyufg ", role, "fghdyt ", UserRole.ARTIST);
      // only fetch galleries for non-artist roles
      if (role != "ROLE_ARTIST") {
        dispatch(fetchGalleries());
      }
    }
    // always fetch artworks
    dispatch(fetchArtworks());
  }, [dispatch, user]);

  const handleCreateGallery = async () => {
    if (newGallery.name && newGallery.description) {
      await dispatch(createGallery(newGallery));
      setCreateDialogOpen(false);
      setNewGallery({ name: "", description: "", isPublic: true });
    }
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getRoleBasedStats = () => {
    const userGalleries = galleries?.filter((g) => g.ownerId === user?.id);
    const userArtworks = artworks?.filter((a) => a.artistId === user?.id);
    const publicGalleries = galleries?.filter((g) => g.isPublic);
    const artistGalleries = galleries?.filter((g) => g?.artistId === user?.id);

    switch (role) {
      case UserRole.ADMIN:
        return [
          {
            title: "Total Users",
            value: 245,
            icon: <People />,
            color: "#1976d2",
            change: "+12%",
          },
          {
            title: "Total Galleries",
            value: galleries?.length,
            icon: <PhotoLibrary />,
            color: "#2e7d32",
            change: "+8%",
          },
          {
            title: "Total Artworks",
            value: artworks?.length,
            icon: <Image />,
            color: "#ed6c02",
            change: "+23%",
          },
          {
            title: "Public Galleries",
            value: publicGalleries?.length,
            icon: <TrendingUp />,
            color: "#9c27b0",
            change: "+5%",
          },
        ];
      case UserRole.GALLERY_MANAGER:
        return [
          {
            title: "My Galleries",
            value: userGalleries?.length || 0,
            icon: <PhotoLibrary />,
            color: "#1976d2",
            change: "+2",
          },
          {
            title: "My Artworks",
            value: userArtworks?.length || 0,
            icon: <Image />,
            color: "#2e7d32",
            change: "+18",
          },
          {
            title: "Total Views",
            value:
              userArtworks?.reduce(
                (sum, a) => sum + (a.artworkCount || 0),
                0
              ) || 0,
            icon: <People />,
            color: "#ed6c02",
            change: "+3",
          },
          // {
          //   title: "Public Galleries",
          //   value: userGalleries?.filter((g) => g.isPublic).length,
          //   icon: <TrendingUp />,
          //   color: "#9c27b0",
          //   change: "+15%",
          // },
        ];
      case UserRole.ARTIST:
        return [
          {
            title: "My Artworks",
            value: userArtworks?.length,
            icon: <Image />,
            color: "#1976d2",
            change: "+3",
          },
          {
            title: "In Galleries",
            value: artistGalleries?.length,
            icon: <PhotoLibrary />,
            color: "#2e7d32",
          },
          {
            title: "For Sale",
            value: userArtworks?.filter((a: any) => a.isForSale).length,
            icon: <Visibility />,
            color: "#ed6c02",
            change: "+45",
          },
          {
            title: "For Featured",
            value: userArtworks?.filter((a: any) => a.isFeatured).length,
            icon: <Visibility />,
            color: "#ed6c02",
            change: "+45",
          },
          {
            title: "Total Revenue",
            value: `${userArtworks
              ?.filter((a: any) => a.price)
              .reduce((sum: number, a: any) => {
                return a?.status === "SOLD" ? sum + (a.price || 0) : sum;
              }, 0)}`,
            icon: <TrendingUp />,
            color: "#9c27b0",
            change: "+12",
          },
        ];
      default:
        return [
          {
            title: "Public Galleries",
            value: publicGalleries?.length,
            icon: <PhotoLibrary />,
            color: "#1976d2",
          },
          {
            title: "Available Artworks",
            value: artworks?.filter((a: any) => a.isForSale).length,
            icon: <Image />,
            color: "#2e7d32",
          },
          {
            title: "Artists",
            value: new Set(artworks?.map((a: any) => a.artistId)).size,
            icon: <People />,
            color: "#ed6c02",
          },
          {
            title: "Avg Price",
            value: `${Math.round(
              artworks
                ?.filter((a: any) => a.price)
                .reduce(
                  (sum: any, a: any, _: any, arr: any) =>
                    sum + (a.price || 0) / arr.length,
                  0
                )
            )}`,
            icon: <TrendingUp />,
            color: "#9c27b0",
          },
        ];
    }
  };

  const getQuickActions = () => {
    switch (role) {
      case UserRole.ADMIN:
        return [
          {
            label: "View All Galleries",
            icon: <PhotoLibrary />,
            action: () => window.open("/galleries", "_blank"),
          },
          {
            label: "Create Gallery",
            icon: <Add />,
            action: () => setCreateDialogOpen(true),
          },
          { label: "System Settings", icon: <Edit />, action: () => {} },
        ];
      case UserRole.GALLERY_MANAGER:
        return [
          {
            label: "Create Gallery",
            icon: <Add />,
            action: () => router.push("/galleries"),
          },
          {
            label: "Browse Galleries",
            icon: <PhotoLibrary />,
            action: () => router.push("/galleries"),
          },
          {
            label: "Create Artwork",
            icon: <Add />,

            action: () => router.push("/account/artworks/new"),
          },
        ];
      case UserRole.ARTIST:
        return [
          {
            label: "Create Artwork",
            icon: <Add />,
            action: () =>  router.push('/account/artworks/new'),
          },
          {
            label: "My Artwork",
            icon: <PhotoLibrary />,
            action: () => router.push("/artworks"),
          },
        ];
      default:
        return [
          {
            label: "Browse Galleries",
            icon: <PhotoLibrary />,
            action: () => window.open("/galleries", "_blank"),
          },
          {
            label: "View Artworks",
            icon: <Image />,
            action: () => window.open("/artworks", "_blank"),
          },
          { label: "Live Auctions", icon: <TrendingUp />, action: () => {} },
        ];
    }
  };

  if (!isAuthenticated) {
    return <ProtectedRoute />;
  }
  return (
    <ProtectedRoute>
      <DashboardLayout>
        {isLoading && (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {!isLoading && !error && user ? (
          <>
            {/* Welcome Section */}
            <Box mb={4}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {getWelcomeMessage()}, {user?.firstName}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Welcome to your ArtCloud dashboard. Here's what's happening with
                your galleries today.
              </Typography>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} mb={4}>
              {getRoleBasedStats().map((stat) => (
                <Grid item xs={12} sm={6} lg={3} key={stat.title}>
                  <StatCard {...stat} />
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3}>
              {/* Quick Actions */}
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Quick Actions
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                      {getQuickActions().map((action) => (
                        <Button
                          key={action.label}
                          variant="outlined"
                          startIcon={action.icon}
                          fullWidth
                          onClick={action.action}
                          sx={{ justifyContent: "flex-start" }}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Recent Galleries */}

              {role !== UserRole.ARTIST && (
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        {user?.role === UserRole.ADMIN
                          ? "Latest Galleries"
                          : "My Recent Galleries"}
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => window.open("/galleries", "_blank")}
                      >
                        View All
                      </Button>
                    </Box>
                    {isLoading ? (
                      <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                      </Box>
                    ) : error ? (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                      </Alert>
                    ) : (
                      <Box>
                        {galleries
                          ?.filter((g) =>
                            user?.role === UserRole.ADMIN
                              ? true
                              : g.ownerId === user?.id
                          )
                          .slice(0, 3)
                          .map((gallery) => (
                            <RecentItem
                              key={gallery.id}
                              title={gallery.name}
                              subtitle={`${gallery.artworkCount} artworks • ${
                                gallery.isPublic ? "Public" : "Private"
                              }`}
                              image={gallery.coverImage}
                              status={
                                gallery.isPublic ? "Published" : "Private"
                              }
                              onView={() =>
                                window.open(
                                  `/galleries/${gallery.id}`,
                                  "_blank"
                                )
                              }
                              onEdit={() =>
                                window.open(
                                  `/galleries/${gallery.id}/edit`,
                                  "_blank"
                                )
                              }
                            />
                          ))}
                        {galleries?.filter((g) =>
                          user?.role === UserRole.ADMIN
                            ? true
                            : g.ownerId === user?.id
                        ).length === 0 && (
                          <Box textAlign="center" py={3}>
                            <Typography color="text.secondary">
                              No galleries yet. Create your first gallery to get
                              started!
                            </Typography>
                            <Button
                              variant="outlined"
                              startIcon={<Add />}
                              onClick={() => setCreateDialogOpen(true)}
                              sx={{ mt: 2 }}
                            >
                              Create Gallery
                            </Button>
                          </Box>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              )}
            
            </Grid>

            {/* Gallery Grid Section */}
            {user?.role !== UserRole.VIEWER && (
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={3}
                      >
                        <Typography variant="h6" fontWeight="bold">
                          Gallery Overview
                        </Typography>
                        <Box display="flex" gap={1}>
                          <Button
                            variant="outlined"
                            startIcon={<Add />}
                            onClick={() => setCreateDialogOpen(true)}
                          >
                            Create Gallery
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<PhotoLibrary />}
                            onClick={() => window.open("/galleries", "_blank")}
                          >
                            Browse All
                          </Button>
                        </Box>
                      </Box>

                      {isLoading ? (
                        <Grid container spacing={2}>
                          {Array.from({ length: 3 }).map((_, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                              <Card>
                                <Box
                                  sx={{ height: 140, bgcolor: "grey.100" }}
                                />
                                <CardContent sx={{ p: 2 }}>
                                  <Box
                                    sx={{
                                      height: 20,
                                      bgcolor: "grey.200",
                                      mb: 1,
                                      borderRadius: 1,
                                    }}
                                  />
                                  <Box
                                    sx={{
                                      height: 16,
                                      bgcolor: "grey.100",
                                      borderRadius: 1,
                                      width: "70%",
                                    }}
                                  />
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Grid container spacing={2}>
                          {galleries
                            ?.filter((g) =>
                              user?.role === UserRole.ADMIN
                                ? true
                                : g.ownerId === user?.id
                            )
                            .slice(0, 6)
                            .map((gallery) => (
                              <Grid item xs={12} sm={6} md={4} key={gallery.id}>
                                <Card
                                  sx={{
                                    cursor: "pointer",
                                    transition:
                                      "transform 0.2s, boxShadow 0.2s",
                                    "&:hover": {
                                      transform: "translateY(-2px)",
                                      boxShadow: 3,
                                    },
                                  }}
                                  onClick={() =>
                                    window.open(
                                      `/galleries/${gallery.id}`,
                                      "_blank"
                                    )
                                  }
                                >
                                  <CardMedia
                                    component="img"
                                    height="140"
                                    image={
                                      gallery.coverImage ||
                                      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop"
                                    }
                                    alt={gallery.name}
                                  />
                                  <CardContent sx={{ p: 2 }}>
                                    <Box
                                      display="flex"
                                      justifyContent="space-between"
                                      alignItems="start"
                                      mb={1}
                                    >
                                      <Typography
                                        variant="subtitle1"
                                        fontWeight="medium"
                                        noWrap
                                      >
                                        {gallery.name}
                                      </Typography>
                                      <Chip
                                        size="small"
                                        label={
                                          gallery.isPublic
                                            ? "Public"
                                            : "Private"
                                        }
                                        color={
                                          gallery.isPublic
                                            ? "success"
                                            : "default"
                                        }
                                      />
                                    </Box>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      noWrap
                                    >
                                      {gallery.artworkCount}{" "}
                                      {gallery.artworkCount === 1
                                        ? "artwork"
                                        : "artworks"}
                                    </Typography>
                                  </CardContent>
                                </Card>
                              </Grid>
                            ))}
                        </Grid>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

          </>
        ) : null}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
