// src/pages/SurveyEditPage.tsx
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
  Grid,
  Paper,
  CircularProgress,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../../context/AuthContext.tsx";
import toast from "react-hot-toast";

export default function SurveyEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token } = useAuth()

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
        queryKey: ["survey", id]
      });
      toast.success("Pregunta actualizada exitosamente", {
        position: "top-center",
      });
      navigate("/dashboard");
    },
  });

  const [surveyData, setSurveyData] = useState<any>(null);

  useEffect(() => {
    if (data) {
      setSurveyData(data);
    }
  }, [data]);

  if (isLoading || !surveyData) return <CircularProgress/>;

  const handleQuestionChange = (questionId: number | string, key: string, value: any) => {
    setSurveyData((prev: any) => ({
      ...prev,
      questions: prev.questions.map((q: any) =>
        q.id === questionId || q.id === questionId.toString()
          ? { ...q, [key]: value }
          : q
      ),
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
        { id: `new-${Date.now()}`, label: "", type: "open", options: [] },
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
          ? { ...q, options: [...q.options, { label: "" }] }
          : q
      ),
    }));
  };

  const handleRemoveOption = (questionId: number | string, index: number) => {
    setSurveyData((prev: any) => ({
      ...prev,
      questions: prev.questions.map((q: any) =>
        q.id === questionId || q.id === questionId.toString()
          ? {
              ...q,
              options: q.options.filter((_: any, idx: number) => idx !== index),
            }
          : q
      ),
    }));
  };

    const handleSave = () => {1
      const payload = {
        ...surveyData,
        questions: surveyData.questions.map((q: any) => {
          if (typeof q.id === "string" && q.id.startsWith("new-")) {
            return { ...q, id: undefined };
          }
          return q;
        }),
      };
    
      mutation.mutate({ id: id!, payload });
    };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
         Editar Encuesta
      </Typography>

    {/* Switch para activar/desactivar la encuesta */}
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
        label={surveyData.active ? "Encuesta activa" : "Encuesta inactiva"}
        sx={{ mb: 3 }}
      />
      
      <TextField
        fullWidth
        label="Título"
        value={surveyData.title}
        onChange={(e) =>
          setSurveyData((prev: any) => ({ ...prev, title: e.target.value }))
        }
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Descripción"
        value={surveyData.description || ""}
        onChange={(e) =>
          setSurveyData((prev: any) => ({ ...prev, description: e.target.value }))
        }
        sx={{ mb: 4 }}
      />

      {surveyData.questions.map((q: any, qIdx: number) => (
        <Paper key={q.id} sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs:10 }}>
              <TextField
                fullWidth
                label={`Pregunta ${qIdx + 1}`}
                value={q.label}
                onChange={(e) => handleQuestionChange(q.id, "label", e.target.value)}
                sx={{ mb: 1 }}
              />
              <Select
                fullWidth
                value={q.type}
                onChange={(e) => handleQuestionChange(q.id, "type", e.target.value)}
                sx={{ mb: 1 }}
              >
                <MenuItem value="open">Abierta</MenuItem>
                <MenuItem value="multiple_choice">Opción múltiple</MenuItem>
                <MenuItem value="boolean">Verdadero/Falso</MenuItem>
                <MenuItem value="scale">Escala 1-5</MenuItem>
              </Select>

              {(q.type === "multiple_choice" || q.type === "boolean") &&
                q.options.map((o: any, oIdx: number) => (
                  <Box key={oIdx} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <TextField
                      fullWidth
                      value={o.label}
                      onChange={(e) =>
                        handleOptionChange(q.id, oIdx, e.target.value)
                      }
                    />
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveOption(q.id, oIdx)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}

              {(q.type === "multiple_choice" || q.type === "boolean") && (
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => handleAddOption(q.id)}
                  sx={{ mt: 1 }}
                >
                  Agregar opción
                </Button>
              )}
            </Grid>

            <Grid size={{ xs:2 }}>
              <IconButton
                color="error"
                onClick={() => handleRemoveQuestion(q.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAddQuestion}
        sx={{ mb: 4 }}
      >
        Agregar pregunta
      </Button>

      <Box>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Guardar cambios
        </Button>
        <Button
          variant="text"
          sx={{ ml: 2 }}
          onClick={() => navigate("/dashboard")}
        >
          Cancelar
        </Button>
      </Box>
    </Box>
  );
}
