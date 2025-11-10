import { Box, Typography, alpha } from '@mui/material';

interface Props {
  data: Array<{
    date: string;
    count: number;
  }>;
}

const ResponseTimelineChart = ({ data }: Props) => {
  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          py: 6,
          textAlign: 'center',
          bgcolor: alpha('#f5f5f5', 0.3),
          borderRadius: 2
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No hay datos de respuestas aún
        </Typography>
      </Box>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 0.5,
        height: 250,
        py: 2
      }}
    >
      {data.map((item, index) => {
        const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
        const date = new Date(item.date);
        const formattedDate = date.toLocaleDateString('es-ES', {
          month: 'short',
          day: 'numeric',
        });

        return (
          <Box
            key={index}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              minWidth: '40px'
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: 200,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center'
              }}
            >
              <Box
                sx={{
                  width: '70%',
                  height: `${height}%`,
                  background: 'linear-gradient(to top, #667eea 0%, #764ba2 100%)',
                  borderRadius: '6px 6px 0 0',
                  minHeight: '4px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  pt: 0.5,
                  '&:hover': {
                    opacity: 0.8,
                    transform: 'scaleY(1.05)'
                  }
                }}
                title={`${formattedDate}: ${item.count} respuestas`}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {item.count}
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                transform: 'rotate(-45deg)',
                transformOrigin: 'center',
                whiteSpace: 'nowrap',
                mt: 2,
                fontSize: '0.7rem'
              }}
            >
              {formattedDate}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default ResponseTimelineChart;