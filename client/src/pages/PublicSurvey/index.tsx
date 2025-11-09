import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getSurveyById } from "../../http/survey.ts";
import {
  Box,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  CircularProgress,
  Button,
  Paper,
  Card,
  CardContent,
  Checkbox,
  FormGroup,
  Alert,
  Stack,
  Chip,
} from "@mui/material";
import { useState } from "react";
import { CheckCircle } from "@mui/icons-material";
import toast from "react-hot-toast";

enum QuestionType {
  OPEN = 'open',
  SCALE = 'scale',
  MULTIPLE_CHOICE_ONE_ANSWER = 'multiple_choice_one_answer',
  MULTIPLE_CHOICE_MULTIPLE_ANSWER = 'multiple_choice_multiple_answer',
}

export default function SurveyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [submitted, setSubmitted] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["survey", id],
    queryFn: () => getSurveyById(id!),
    enabled: !!id,
  });

  const submitMutation = useMutation({
    mutationFn: async (payload: any) => {
      return Promise.resolve();
    },
    onSuccess: () => {
      setSubmitted(true);
      toast.success("¡Respuestas enviadas exitosamente!", {
        position: "top-center",
      });
    },
    onError: () => {
      toast.error("Error al enviar las respuestas", {
        position: "top-center",
      });
    },
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 8 }}>
        <Alert severity="error">Encuesta no encontrada</Alert>
      </Box>
    );
  }

  const handleChange = (questionId: number, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxChange = (questionId: number, optionLabel: string, checked: boolean) => {
    setAnswers((prev) => {
      const current = prev[questionId] || [];
      if (checked) {
        return { ...prev, [questionId]: [...current, optionLabel] };
      } else {
        return { ...prev, [questionId]: current.filter((item: string) => item !== optionLabel) };
      }
    });
  };

  const handleSubmit = () => {
    const unanswered = data.questions.filter((q: any) => !answers[q.id]);
    
    if (unanswered.length > 0) {
      toast.error("Por favor responde todas las preguntas", {
        position: "top-center",
      });
      return;
    }

    const payload = {
      surveyId: id,
      responses: Object.entries(answers).map(([questionId, answer]) => ({
        questionId: Number(questionId),
        answer,
      })),
    };

    submitMutation.mutate(payload);
  };

  if (!data.active) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Esta encuesta ha sido desactivada por el administrador
          </Alert>
          <Button variant="outlined" onClick={() => navigate("/")}>
            Volver al inicio
          </Button>
        </Paper>
      </Box>
    );
  }

  if (data.questions.length === 0) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Esta encuesta no tiene preguntas activas. Por favor contacte al administrador.
          </Alert>
          <Button variant="outlined" onClick={() => navigate("/")}>
            Volver al inicio
          </Button>
        </Paper>
      </Box>
    );
  }

  if (submitted) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 8 }}>
        <Paper elevation={3} sx={{ p: 6, textAlign: "center" }}>
          <CheckCircle sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
          <Typography variant="h4" fontWeight={600} mb={2}>
            ¡Gracias por tu participación!
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Tus respuestas han sido registradas exitosamente.
          </Typography>
          <Button variant="contained" onClick={() => navigate("/")}>
            Volver al inicio
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: 3, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            {data.title}
          </Typography>
          {data.description && (
            <Typography variant="body1" color="text.secondary" paragraph>
              {data.description}
            </Typography>
          )}
          <Chip 
            label={`${data.questions.length} pregunta${data.questions.length !== 1 ? 's' : ''}`} 
            color="primary" 
            size="small" 
          />
        </Box>

        {/* Preguntas */}
        <Stack spacing={3}>
          {data.questions.map((q: any, index: number) => (
            <Card key={q.id} variant="outlined" sx={{ bgcolor: "#fafafa" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  {index + 1}. {q.label}
                  <Typography component="span" color="error" ml={0.5}>
                    *
                  </Typography>
                </Typography>

                {/* Pregunta abierta */}
                {q.type === QuestionType.OPEN && (
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Escribe tu respuesta aquí..."
                    value={answers[q.id] || ""}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                  />
                )}

                {/* Escala numérica */}
                {q.type === QuestionType.SCALE && (
                  <Box sx={{ px: 2 }}>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      marks={[
                        { value: 1, label: '1' },
                        { value: 5, label: '5' },
                        { value: 10, label: '10' },
                      ]}
                      value={answers[q.id] || 5}
                      onChange={(_, value) => handleChange(q.id, value)}
                      valueLabelDisplay="on"
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Nada probable
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Muy probable
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Opción múltiple (una respuesta) */}
                {q.type === QuestionType.MULTIPLE_CHOICE_ONE_ANSWER && (
                  <RadioGroup
                    value={answers[q.id] ?? ""}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                  >
                    {q.options?.map((o: any) => (
                      <FormControlLabel
                        key={o.id}
                        value={o.label}
                        control={<Radio />}
                        label={o.label}
                      />
                    ))}
                  </RadioGroup>
                )}

                {/* Opción múltiple (múltiples respuestas) */}
                {q.type === QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWER && (
                  <FormGroup>
                    {q.options?.map((o: any) => (
                      <FormControlLabel
                        key={o.id}
                        control={
                          <Checkbox
                            checked={(answers[q.id] || []).includes(o.label)}
                            onChange={(e) =>
                              handleCheckboxChange(q.id, o.label, e.target.checked)
                            }
                          />
                        }
                        label={o.label}
                      />
                    ))}
                  </FormGroup>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>

        {/* Botón de envío */}
        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/")}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending ? "Enviando..." : "Enviar respuestas"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}