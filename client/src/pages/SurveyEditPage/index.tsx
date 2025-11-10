import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSurveyByIdToUpdate, updateSurvey } from "../../http/survey.ts";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  IconButton,
  Paper,
  CircularProgress,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Stack,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Delete, Add } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext.tsx";
import toast from "react-hot-toast";

enum QuestionType {
  OPEN = 'open',
  SCALE = 'scale',
  MULTIPLE_CHOICE_ONE_ANSWER = 'multiple_choice_one_answer',
  MULTIPLE_CHOICE_MULTIPLE_ANSWER = 'multiple_choice_multiple_answer',
}

export default function SurveyEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["survey", id],
    queryFn: () => getSurveyByIdToUpdate(id!),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      updateSurvey(id, payload, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["survey", id],
      });
      toast.success("Encuesta actualizada exitosamente", {
        position: "top-center",
      });
      navigate("/dashboard");
    },
    onError: () => {
      toast.error("Error al actualizar la encuesta", {
        position: "top-center",
      });
    },
  });

  const [surveyData, setSurveyData] = useState<any>(null);

  useEffect(() => {
    if (data) {
      setSurveyData(data);
    }
  }, [data]);

  if (isLoading || !surveyData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  const needsOptions = (type: string) =>
    type === QuestionType.MULTIPLE_CHOICE_ONE_ANSWER ||
    type === QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWER;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case QuestionType.OPEN:
        return "Respuesta abierta";
      case QuestionType.SCALE:
        return "Escala numérica";
      case QuestionType.MULTIPLE_CHOICE_ONE_ANSWER:
        return "Opción múltiple (una respuesta)";
      case QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWER:
        return "Opción múltiple (varias respuestas)";
      default:
        return type;
    }
  };

  const handleQuestionChange = (questionId: number | string, key: string, value: any) => {
    setSurveyData((prev: any) => ({
      ...prev,
      questions: prev.questions.map((q: any) => {
        if (q.id === questionId || q.id === questionId.toString()) {
          const updated = { ...q, [key]: value };
          if (key === "type" && !needsOptions(value)) {
            updated.options = [];
          }
          return updated;
        }
        return q;
      }),
    }));
  };

  const handleOptionChange = (questionId: number | string, optionIndex: number, value: string) => {
    setSurveyData((prev: any) => ({
      ...prev,
      questions: prev.questions.map((q: any) => {
        if (q.id === questionId || q.id === questionId.toString()) {
          const newOptions = q.options.map((o: any, idx: number) =>
            idx === optionIndex ? { ...o, label: value } : o
          );
          return { ...q, options: newOptions };
        }
        return q;
      }),
    }));
  };

  const handleAddQuestion = () => {
    setSurveyData((prev: any) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: `new-${Date.now()}`,
          label: "",
          type: QuestionType.OPEN,
          options: [],
          active: true,
        },
      ],
    }));
  };

  const handleRemoveQuestion = (questionId: number | string) => {
    setSurveyData((prev: any) => ({
      ...prev,
      questions: prev.questions.filter(
        (q: any) => q.id !== questionId && q.id.toString() !== questionId.toString()
      ),
    }));
  };

  const handleAddOption = (questionId: number | string) => {
    setSurveyData((prev: any) => ({
      ...prev,
      questions: prev.questions.map((q: any) =>
        q.id === questionId || q.id === questionId.toString()
          ? { ...q, options: [...(q.options || []), { label: "" }] }
          : q
      ),
    }));
  };

  const handleRemoveOption = (questionId: number | string, optionIndex: number) => {
    setSurveyData((prev: any) => ({
      ...prev,
      questions: prev.questions.map((q: any) =>
        q.id === questionId || q.id === questionId.toString()
          ? {
              ...q,
              options: q.options.filter((_: any, idx: number) => idx !== optionIndex),
            }
          : q
      ),
    }));
  };

  const handleSave = () => {
    const payload = {
      title: surveyData.title,
      description: surveyData.description,
      active: surveyData.active,
      questions: surveyData.questions.map((q: any) => {
        const question: any = {
          label: q.label,
          type: q.type,
        };

        if (typeof q.id === "number") {
          question.id = q.id;
        }

        if (needsOptions(q.type) && q.options) {
          question.options = q.options.map((opt: any) => {
            const option: any = { label: opt.label };
            if (opt.id) {
              option.id = opt.id;
            }
            return option;
          });
        }

        return question;
      }),
    };

    mutation.mutate({ id: id!, payload });
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={700} mb={3}>
          Editar Encuesta
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={surveyData.active}
              onChange={(e) =>
                setSurveyData((prev: any) => ({
                  ...prev,
                  active: e.target.checked,
                }))
              }
              color="primary"
            />
          }
          label={
            <Typography variant="body2" color={surveyData.active ? "success.main" : "text.secondary"}>
              {surveyData.active ? "Encuesta activa" : "Encuesta inactiva"}
            </Typography>
          }
          sx={{ mb: 3 }}
        />

        <Stack spacing={3} mb={4}>
          <TextField
            fullWidth
            label="Título de la encuesta"
            required
            value={surveyData.title}
            onChange={(e) =>
              setSurveyData((prev: any) => ({ ...prev, title: e.target.value }))
            }
          />

          <TextField
            fullWidth
            label="Descripción (opcional)"
            multiline
            rows={3}
            value={surveyData.description || ""}
            onChange={(e) =>
              setSurveyData((prev: any) => ({ ...prev, description: e.target.value }))
            }
          />
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" fontWeight={600} mb={2}>
          Preguntas
        </Typography>

        {surveyData.questions.map((q: any, qIdx: number) => (
          <Card key={q.id} sx={{ mb: 3, backgroundColor: "#f9f9f9" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Pregunta {qIdx + 1}
                </Typography>

                <Box>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveQuestion(q.id)}
                    title="Eliminar pregunta"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>

              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Texto de la pregunta"
                  required
                  value={q.label}
                  onChange={(e) => handleQuestionChange(q.id, "label", e.target.value)}
                />

                <FormControl fullWidth>
                  <InputLabel>Tipo de pregunta</InputLabel>
                  <Select
                    value={q.type}
                    label="Tipo de pregunta"
                    onChange={(e) => handleQuestionChange(q.id, "type", e.target.value)}
                  >
                    <MenuItem value={QuestionType.OPEN}>{getTypeLabel(QuestionType.OPEN)}</MenuItem>
                    <MenuItem value={QuestionType.SCALE}>{getTypeLabel(QuestionType.SCALE)}</MenuItem>
                    <MenuItem value={QuestionType.MULTIPLE_CHOICE_ONE_ANSWER}>
                      {getTypeLabel(QuestionType.MULTIPLE_CHOICE_ONE_ANSWER)}
                    </MenuItem>
                    <MenuItem value={QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWER}>
                      {getTypeLabel(QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWER)}
                    </MenuItem>
                  </Select>
                </FormControl>

                {needsOptions(q.type) && (
                  <Box
                    sx={{
                      pl: 2,
                      borderLeft: "3px solid #1976d2",
                      bgcolor: "#e3f2fd",
                      p: 2,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={600} mb={1}>
                      Opciones{" "}
                      {q.type === QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWER &&
                        "(Se pueden seleccionar varias)"}
                    </Typography>

                    {q.options?.map((o: any, oIdx: number) => (
                      <Box key={oIdx} sx={{ display: "flex", gap: 1, mb: 1 }}>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder={`Opción ${oIdx + 1}`}
                          value={o.label}
                          onChange={(e) => handleOptionChange(q.id, oIdx, e.target.value)}
                        />
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveOption(q.id, oIdx)}
                          title="Eliminar opción"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    ))}

                    <Button
                      size="small"
                      startIcon={<Add />}
                      onClick={() => handleAddOption(q.id)}
                      sx={{ mt: 1 }}
                    >
                      Agregar opción
                    </Button>

                    {q.options && q.options.length < 2 && (
                      <Typography variant="caption" color="error" display="block" mt={1}>
                        ⚠️ Se requieren al menos 2 opciones
                      </Typography>
                    )}
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}

        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={handleAddQuestion}
          fullWidth
          sx={{ mb: 3 }}
        >
          Agregar Pregunta
        </Button>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button variant="outlined" color="secondary" onClick={() => navigate("/dashboard")}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!surveyData.title || surveyData.questions.length === 0 || mutation.isPending}
          >
            {mutation.isPending ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}