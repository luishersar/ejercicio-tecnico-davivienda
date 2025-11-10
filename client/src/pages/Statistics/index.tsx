import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Avatar,
  Stack,
  Button,
  alpha,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PollOutlined as PollIcon,
  QuestionAnswer as QuestionAnswerIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import QuestionStatisticsCard from '../../components/Statistics/QuestionsStatisticsCard';
import ResponseTimelineChart from '../../components/Statistics/ResponseLineTimeChart';
import { getSurveyStatistics } from '../../http/statistics';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';

const SurveyStatistics = () => {
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ["getSurveyStatistics"],
    queryFn: () => getSurveyStatistics(Number(surveyId), token!),
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: { xs: 2, md: 4 } }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error.message}
        </Alert>
      </Box>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: { xs: 2, md: 4 }, mb: 4 }}>
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
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2, textTransform: 'none' }}
        >
          Volver al Dashboard
        </Button>

        <Typography variant="h3" fontWeight={700} color="primary" gutterBottom>
          {data.title}
        </Typography>
        
        {data.description && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {data.description}
          </Typography>
        )}
      </Paper>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs:12, sm:4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%'
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                <PollIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  {data.totalResponses}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total de Respuestas
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs:12, sm:4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%'
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                <QuestionAnswerIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  {data.questions.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total de Preguntas
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs:12, sm:4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%'
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                <TrendingUpIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  {data.questions.reduce((sum, q) => sum + q.totalResponses, 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Respuestas Totales
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant="h5" fontWeight={600} color="text.primary" gutterBottom>
          Línea de Tiempo de Respuestas
        </Typography>
        <Divider sx={{ my: 2 }} />
        <ResponseTimelineChart data={data.responseTimeline} />
      </Paper>

      <Box>
        <Typography
          variant="h5"
          fontWeight={600}
          color="text.primary"
          sx={{ mb: 3 }}
        >
          Estadísticas por Pregunta
        </Typography>

        <Stack spacing={3}>
          {data.questions.map((question) => (
            <QuestionStatisticsCard
              key={question.questionId}
              question={question}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default SurveyStatistics;