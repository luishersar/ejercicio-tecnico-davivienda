import { Card, CardContent, CardActions, Typography, Button, Grid, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllSurveys, softDeleteSurvey } from "../../http/survey";
import { CircularProgress } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const { token } = useAuth()
  const queryClient = useQueryClient();

  const { data: surveys, isLoading } = useQuery({
    queryKey: ["getAllSurveys"],
    queryFn: () => getAllSurveys(token!),
  });

   const mutation = useMutation({
    mutationFn: (id: number) => softDeleteSurvey(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["getAllSurveys"]});
      toast.success("Encuesta eliminada correctamente", {
        position: "top-center",
      });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message, { position: "top-center" });
      } else {
        toast.error("Ocurrio un error inesperado.", {
          position: "top-center",
        });
      }
    },
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: "#f7f9fc", minHeight: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight={700} color="primary">
          Mis encuestas
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/surveys/new")}
          sx={{ fontWeight: 600 }}
        >
          + Nueva encuesta
        </Button>
      </Box>

      <Grid container spacing={3}>
      {surveys?.map((survey: any) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={survey.id}>
          <Card
            elevation={3}
            sx={{
              borderRadius: 3,
              backgroundColor: survey.active ? "white" : "#ffe5e5", // rojo claro si inactiva
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={600} color="primary.dark">
                {survey.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Respuestas: {survey.responses ?? 0}
              </Typography>
            </CardContent>
          
            <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
              <Button
                size="small"
                color="primary"
                onClick={() => navigate(`/surveys/${survey.id}/edit`)}
              >
                Editar
              </Button>
              <Button
                size="small"
                color="primary"
                onClick={() => navigate(`/surveys/${survey.id}/stats`)}
              >
                Ver estadísticas
              </Button>
              {survey.active && <Button
                size="small"
                color="error"
                onClick={() => mutation.mutate(survey.id)}
              >
                Eliminar
              </Button>}
            </CardActions>
          </Card>
        </Grid>
      ))}
      </Grid>
    </Box>
  );
}
