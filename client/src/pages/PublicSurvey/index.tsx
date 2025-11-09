import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
} from "@mui/material";
import { useState } from "react";

export default function SurveyPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["survey", id],
    queryFn: () => getSurveyById(id!),
  });

  const [answers, setAnswers] = useState<Record<number, any>>({});

  if (isLoading) return <CircularProgress />;

  const handleChange = (questionId: number, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    console.log("Respuestas enviadas:", answers);
    // Aquí podrías hacer un POST a /surveys/:id/responses
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
    {!data.active ? (
      <Typography color="error" variant="h6" textAlign="center">
        Esta encuesta ha sido inactivada por el administrador
      </Typography>
    ) : data.questions.length === 0 ? (
      <Typography color="text.secondary" variant="h6" textAlign="center">
        Esta encuesta no tiene preguntas activas. Por favor contacte al administrador.
      </Typography>
    ) : (
      <>
        <Typography variant="h4" gutterBottom>
          {data.title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {data.description}
        </Typography>

        {data.questions.map((q: any) => (
          <Box key={q.id} sx={{ mb: 3 }}>
            <Typography variant="h6">{q.label}</Typography>

            {q.type === "open" && (
              <TextField
                fullWidth
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
              />
            )}

            {q.type === "boolean" && (
              <RadioGroup
                value={answers[q.id] ?? ""}
                onChange={(e) => handleChange(q.id, e.target.value === "true")}
              >
                <FormControlLabel value="true" control={<Radio />} label="Sí" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            )}

            {q.type === "scale" && (
              <Slider
                min={0}
                max={5}
                step={1}
                marks
                value={answers[q.id] ?? 0}
                onChange={(_, value) => handleChange(q.id, value)}
              />
            )}

            {q.type === "multiple_choice" && (
              <RadioGroup
                value={answers[q.id] ?? ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
              >
                {q.options.map((o: any) => (
                  <FormControlLabel
                    key={o.id}
                    value={o.label}
                    control={<Radio />}
                    label={o.label}
                  />
                ))}
              </RadioGroup>
            )}
          </Box>
        ))}

        <Button variant="contained" onClick={handleSubmit}>
          Enviar respuestas
        </Button>
      </>
    )}
  </Box>
  );
}
