import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getSurveyById, submitSurveyResponse } from "../../http/survey.ts";
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
  FormHelperText,
} from "@mui/material";
import toast from "react-hot-toast";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { 
  createDynamicSurveyValidation, 
  getInitialValues, 
  transformToApiFormat,
} from '../../yup/index.ts';
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.tsx";

enum QuestionType {
  OPEN = 'open',
  SCALE = 'scale',
  MULTIPLE_CHOICE_ONE_ANSWER = 'multiple_choice_one_answer',
  MULTIPLE_CHOICE_MULTIPLE_ANSWER = 'multiple_choice_multiple_answer',
}

export default function SurveyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [success, SetSucces] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ["survey", id],
    queryFn: () => getSurveyById(id!),
    enabled: !!id,
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: data ? getInitialValues(data) : {},
    resolver: data ? yupResolver(createDynamicSurveyValidation(data)) : undefined,
  });

  const submitMutation = useMutation({
    mutationFn: async (payload: any) => {
      submitSurveyResponse(payload)
    },
    onSuccess: () => {
      toast.success("¡Respuestas enviadas exitosamente!", {
        position: "top-center",
      });
      SetSucces(true)
    },
    onError: () => {
      toast.error("Error al enviar las respuestas", {
        position: "top-center",
      });
    },
  });

  const onSubmit = (values: any) => {
    const payload = {
      surveyId: id,
      responses: transformToApiFormat(values, data),
    };
    submitMutation.mutate(payload);
  };

   const handleBack = () =>{
    if(user){
      navigate("/dashboard");
    }else{
      navigate("/");
    }
  }

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

  if (!data.active) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Esta encuesta ha sido desactivada por el administrador
          </Alert>
          <Button variant="outlined" onClick={handleBack}>
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
          <Button variant="outlined" onClick={handleBack}>
            Volver al inicio
          </Button>
        </Paper>
      </Box>
    );
  }

  return (

    
    (success ? 
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 8,
        textAlign: "center",
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "white"
      }}
    >
      <Typography variant="h4" sx={{ mb: 3 }}>
        La respuesta fue enviada exitosamente 🎉
      </Typography>

      <Button variant="contained" onClick={() => navigate("/")}>
        Volver al inicio
      </Button>
    </Box> : <Box sx={{ maxWidth: 700, mx: "auto", p: 3, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {data.questions.map((q: any, index: number) => {
              const fieldName = `question_${q.id}`;
              const hasError = !!errors[fieldName];
              const errorMessage = errors[fieldName]?.message as string;

              return (
                <Card key={q.id} variant="outlined" sx={{ bgcolor: "#fafafa" }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} mb={2}>
                      {index + 1}. {q.label}
                      <Typography component="span" color="error" ml={0.5}>
                        *
                      </Typography>
                    </Typography>

                    {q.type === QuestionType.OPEN && (
                      <Controller
                        name={fieldName}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Escribe tu respuesta aquí..."
                            error={hasError}
                            helperText={errorMessage}
                          />
                        )}
                      />
                    )}

                    {q.type === QuestionType.SCALE && (
                      <Controller
                        name={fieldName}
                        control={control}
                        render={({ field }) => (
                          <Box>
                            <Box sx={{ px: 2 }}>
                              <Slider
                                {...field}
                                min={1}
                                max={10}
                                step={1}
                                marks={[
                                  { value: 1, label: '1' },
                                  { value: 5, label: '5' },
                                  { value: 10, label: '10' },
                                ]}
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
                            {hasError && (
                              <FormHelperText error>{errorMessage}</FormHelperText>
                            )}
                          </Box>
                        )}
                      />
                    )}

                    {q.type === QuestionType.MULTIPLE_CHOICE_ONE_ANSWER && (
                      <Controller
                        name={fieldName}
                        control={control}
                        render={({ field }) => (
                          <Box>
                            <RadioGroup {...field}>
                              {q.options?.map((o: any) => (
                                <FormControlLabel
                                  key={o.id}
                                  value={o.label}
                                  control={<Radio />}
                                  label={o.label}
                                />
                              ))}
                            </RadioGroup>
                            {hasError && (
                              <FormHelperText error>{errorMessage}</FormHelperText>
                            )}
                          </Box>
                        )}
                      />
                    )}

                    {q.type === QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWER && (
                      <Controller
                        name={fieldName}
                        control={control}
                        render={({ field }) => (
                          <Box>
                            <FormGroup>
                              {q.options?.map((o: any) => (
                                <FormControlLabel
                                  key={o.id}
                                  control={
                                    <Checkbox
                                      checked={field.value?.includes(o.label) || false}
                                      onChange={(e) => {
                                        const values = field.value || [];
                                        if (e.target.checked) {
                                          field.onChange([...values, o.label]);
                                        } else {
                                          field.onChange(
                                            values.filter((v: string) => v !== o.label)
                                          );
                                        }
                                      }}
                                    />
                                  }
                                  label={o.label}
                                />
                              ))}
                            </FormGroup>
                            {hasError && (
                              <FormHelperText error>{errorMessage}</FormHelperText>
                            )}
                          </Box>
                        )}
                      />
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Stack>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              disabled={isSubmitting || submitMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting || submitMutation.isPending}
            >
              {isSubmitting || submitMutation.isPending ? "Enviando..." : "Enviar respuestas"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box> )
  );
}