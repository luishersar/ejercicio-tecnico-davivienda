import {
  Paper,
  Typography,
  Box,
  Chip,
  Stack,
  LinearProgress,
  Divider,
  alpha
} from '@mui/material';
import {
  QuestionStatistics,
  OpenStatistics,
  ScaleStatistics,
  SingleChoiceStatistics,
  MultipleChoiceStatistics,
} from '../../types/types'

interface Props {
  question: QuestionStatistics;
}

const QuestionStatisticsCard = ({ question }: Props) => {
  const renderStatistics = () => {
    switch (question.type) {
      case 'open':
        return <OpenStatsView stats={question.statistics as OpenStatistics} />;
      case 'scale':
        return <ScaleStatsView stats={question.statistics as ScaleStatistics} />;
      case 'single':
        return <SingleChoiceStatsView stats={question.statistics as SingleChoiceStatistics} />;
      case 'multiple':
        return <MultipleChoiceStatsView stats={question.statistics as MultipleChoiceStatistics} />;
      default:
        return <Typography>Tipo de pregunta no soportado</Typography>;
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 3,
          borderColor: 'primary.main'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ flex: 1 }}>
          {question.label}
        </Typography>
        <Chip
          label={getTypeLabel(question.type)}
          size="small"
          sx={{
            bgcolor: alpha('#1976d2', 0.1),
            color: 'primary.main',
            fontWeight: 600
          }}
        />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {question.totalResponses} respuesta{question.totalResponses !== 1 ? 's' : ''}
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {renderStatistics()}
    </Paper>
  );
};

const OpenStatsView = ({ stats }: { stats: OpenStatistics }) => {
  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} color="text.primary" gutterBottom>
        Respuestas Textuales ({stats.responses.length})
      </Typography>

      {stats.responses.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
          No hay respuestas aún
        </Typography>
      ) : (
        <Stack spacing={2} sx={{ maxHeight: 400, overflowY: 'auto', mt: 2 }}>
          {stats.responses.map((response, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 2,
                bgcolor: alpha('#f5f5f5', 0.5),
                borderLeft: 3,
                borderColor: 'primary.main',
                borderRadius: 1
              }}
            >
              <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
                {response.value}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(response.completedAt).toLocaleString('es-ES')}
              </Typography>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};

const ScaleStatsView = ({ stats }: { stats: ScaleStatistics }) => {
  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: 2,
            textAlign: 'center',
            background: `linear-gradient(135deg, ${alpha('#f093fb', 0.8)} 0%, ${alpha('#f5576c', 0.8)} 100%)`,
            color: 'white',
            borderRadius: 2
          }}
        >
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            Promedio
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {stats.average.toFixed(2)}
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: 2,
            textAlign: 'center',
            background: `linear-gradient(135deg, ${alpha('#a8edea', 0.8)} 0%, ${alpha('#fed6e3', 0.8)} 100%)`,
            color: 'text.primary',
            borderRadius: 2
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Mediana
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {stats.median}
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: 2,
            textAlign: 'center',
            background: `linear-gradient(135deg, ${alpha('#fbc2eb', 0.8)} 0%, ${alpha('#a6c1ee', 0.8)} 100%)`,
            color: 'text.primary',
            borderRadius: 2
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Moda
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {stats.mode}
          </Typography>
        </Paper>
      </Stack>

      <Typography variant="subtitle1" fontWeight={600} color="text.primary" gutterBottom>
        Distribución
      </Typography>

      <Stack spacing={1.5} sx={{ mt: 2 }}>
        {stats.distribution.map((item) => (
          <Box key={item.value}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" fontWeight={600}>
                {item.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.count} ({item.percentage.toFixed(1)}%)
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={item.percentage}
              sx={{
                height: 8,
                borderRadius: 1,
                bgcolor: alpha('#1976d2', 0.1),
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 1
                }
              }}
            />
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

const SingleChoiceStatsView = ({ stats }: { stats: SingleChoiceStatistics }) => {
  return (
    <Stack spacing={2}>
      {stats.options.map((option) => (
        <Box key={option.optionId}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" fontWeight={500}>
              {option.label}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {option.count} ({option.percentage.toFixed(1)}%)
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={option.percentage}
            sx={{
              height: 10,
              borderRadius: 1,
              bgcolor: alpha('#48bb78', 0.1),
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #48bb78 0%, #38a169 100%)',
                borderRadius: 1
              }
            }}
          />
        </Box>
      ))}
    </Stack>
  );
};

const MultipleChoiceStatsView = ({ stats }: { stats: MultipleChoiceStatistics }) => {
  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          bgcolor: alpha('#fef3c7', 0.5),
          borderLeft: 3,
          borderColor: '#f59e0b',
          borderRadius: 1
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Los usuarios pueden seleccionar múltiples opciones
        </Typography>
      </Paper>

      <Stack spacing={2}>
        {stats.options.map((option) => (
          <Box key={option.optionId}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" fontWeight={500}>
                {option.label}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                {option.count} ({option.percentage.toFixed(1)}%)
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={option.percentage}
              sx={{
                height: 10,
                borderRadius: 1,
                bgcolor: alpha('#ed8936', 0.1),
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #ed8936 0%, #dd6b20 100%)',
                  borderRadius: 1
                }
              }}
            />
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

const getTypeLabel = (type: string): string => {
  const labels: { [key: string]: string } = {
    open: 'Abierta',
    scale: 'Escala (1-10)',
    single: 'Opción Única',
    multiple: 'Opción Múltiple',
  };
  return labels[type] || type;
};

export default QuestionStatisticsCard;