import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Grid, 
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Stack,
  Paper,
  alpha
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllSurveys, softDeleteSurvey } from "../../http/survey";
import { CircularProgress } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";
import { 
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  BarChart as BarChartIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PollOutlined as PollIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ContentCopy as Copy
} from "@mui/icons-material";
import { useState } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSurvey, setSelectedSurvey] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["getAllSurveys"],
    queryFn: () => getAllSurveys(token!),
  });

  const { surveys = [], responses = 0 } = data ?? {};

  const mutation = useMutation({
    mutationFn: (id: number) => softDeleteSurvey(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllSurveys"] });
      toast.success("Encuesta eliminada correctamente", {
        position: "top-center",
      });
      handleCloseMenu();
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message, { position: "top-center" });
      } else {
        toast.error("Ocurrió un error inesperado.", {
          position: "top-center",
        });
      }
    },
  });

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, survey: any) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedSurvey(survey);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedSurvey(null);
  };

  const handleEdit = () => {
    navigate(`/surveys/${selectedSurvey.id}/edit`);
    handleCloseMenu();
  };

  const handleStats = () => {
    navigate(`/surveys/${selectedSurvey.id}/stats`);
    handleCloseMenu();
  };

  const handleDelete = () => {
    mutation.mutate(selectedSurvey.id);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", p: { xs: 2, md: 4 }, mb: 4 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: `linear-gradient(135deg, ${alpha('#1976d2', 0.1)} 0%, ${alpha('#1976d2', 0.05)} 100%)`,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2
          }}
        >
          <Box>
            <Typography variant="h3" fontWeight={700} color="primary" gutterBottom>
              Mis Encuestas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gestiona y analiza tus encuestas de forma sencilla
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate("/surveys/new")}
            sx={{ 
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            Nueva encuesta
          </Button>
        </Box>
      </Paper>

      {surveys && surveys.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs:12, sm:4 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <PollIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {surveys.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Encuestas totales
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
          <Grid size={{ xs:12, sm:4 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                  <CheckCircleIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {surveys.filter((s: any) => s.active).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Activas
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
          <Grid  size={{ xs:12, sm:4 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                  <BarChartIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {responses}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Respuestas totales
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      )}

      {surveys && surveys.length > 0 ? (
        <Grid container spacing={3}>
          {surveys.map((survey: any) => (
            <Grid size={{ xs:12, sm:6, md: 4 }} key={survey.id}>
              <Card
                elevation={0}
                onClick={() => navigate(`/surveys/${survey.id}`)}
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: survey.active ? 'divider' : 'gray',
                  bgcolor: survey.active ? 'background.paper' : alpha('#6b6767ff', 0.05),
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 6,
                    borderColor: survey.active ? 'primary.main' : 'gray',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Chip
                      icon={survey.active ? <CheckCircleIcon /> : <CancelIcon />}
                      label={survey.active ? "Activa" : "Inactiva"}
                      size="small"
                      color={survey.active ? "success" : "default"}
                      sx={{ fontWeight: 600 }}
                    />
                    {survey.active && <Chip
                      icon={<Copy />}
                      label={`Comparte el codigo: ${survey.id}`}
                      size="small"
                      color={"default"}
                      sx={{ fontWeight: 600 }}
                    />}
                    <IconButton
                      size="small"
                      onClick={(e) => handleOpenMenu(e, survey)}
                      sx={{ 
                        '&:hover': { 
                          bgcolor: alpha('#000', 0.04) 
                        } 
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  <Typography 
                    variant="h6" 
                    fontWeight={600} 
                    color="text.primary"
                    sx={{ 
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: '3.6em'
                    }}
                  >
                    {survey.title}
                  </Typography>

                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Respuestas
                      </Typography>
                      <Chip 
                        label={survey.responses.length ?? 0} 
                        size="small" 
                        sx={{ 
                          bgcolor: alpha('#1976d2', 0.1),
                          color: 'primary.main',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                    
                    {survey.questions && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Preguntas
                        </Typography>
                        <Chip 
                          label={survey.questions.filter((q: any) => q.active).length ?? 0}
                          size="small"
                          sx={{ 
                            bgcolor: alpha('#2e7d32', 0.1),
                            color: 'success.main',
                            fontWeight: 600
                          }}
                        />
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 8, 
            textAlign: 'center',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <PollIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" fontWeight={600} color="text.secondary" gutterBottom>
            No tienes encuestas aún
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Crea tu primera encuesta para comenzar a recopilar respuestas
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate("/surveys/new")}
            sx={{ 
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            Crear encuesta
          </Button>
        </Paper>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        onClick={(e) => e.stopPropagation()}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 180,
            boxShadow: 3
          }
        }}
      >
        <MenuItem onClick={handleEdit} sx={{ py: 1.5 }}>
          <EditIcon sx={{ mr: 1.5, fontSize: 20 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={handleStats} sx={{ py: 1.5 }}>
          <BarChartIcon sx={{ mr: 1.5, fontSize: 20 }} />
          Ver estadísticas
        </MenuItem>
        {selectedSurvey?.active && (
          <MenuItem 
            onClick={handleDelete} 
            sx={{ py: 1.5, color: 'error.main' }}
          >
            <DeleteIcon sx={{ mr: 1.5, fontSize: 20 }} />
            Inactivar
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}