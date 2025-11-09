import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Divider,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add, Delete, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import { createSurvey } from '../../http/survey';
import { useAuth } from "../../context/AuthContext";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


enum QuestionType {
  OPEN = 'open',
  SCALE = 'scale',
  MULTIPLE_CHOICE_ONE_ANSWER = 'multiple_choice_one_answer',
  MULTIPLE_CHOICE_MULTIPLE_ANSWER = 'multiple_choice_multiple_answer',
}

interface Option {
  id?: number;
  label: string;
}

interface Question {
  id?: number | string;
  label: string;
  type: QuestionType;
  options?: Option[];
  active?: boolean;
}

interface Survey {
  id?: number;
  title: string;
  description: string;
  questions: Question[];
  active?: boolean;
}

interface SurveyFormProps {
  initialData?: Survey;
  onSubmit?: (data: any) => Promise<any>;
  onCancel?: () => void;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export default function SurveyForm() {
  const [survey, setSurvey] = useState<Survey>({
    title: '',
    description: '',
    questions: [],
  });

  const navigate = useNavigate();
  const { token } = useAuth()

  const mutation = useMutation({
    mutationFn: async (payload: any) => {await createSurvey(payload, token!)},
      onSuccess: () => {
          toast.success("Encuesta creada exitosamente", {
            position: "top-center",
          });
          navigate("/dashboard");
        },
      onError: () => {
          toast.error("Error al crear la encuesta", {
            position: "top-center",
          });
        },
      });

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `temp-${Date.now()}`,
      label: '',
      type: QuestionType.OPEN,
      options: [],
      active: true,
    };
    setSurvey({ ...survey, questions: [...survey.questions, newQuestion] });
  };

  const deleteQuestion = (index: number) => {
    const newQuestions = survey.questions.filter((_, i) => i !== index);
    setSurvey({ ...survey, questions: newQuestions });
  };

  const moveQuestionUp = (index: number) => {
    if (index === 0) return;
    const newQuestions = [...survey.questions];
    [newQuestions[index], newQuestions[index - 1]] = [newQuestions[index - 1], newQuestions[index]];
    setSurvey({ ...survey, questions: newQuestions });
  };

  const moveQuestionDown = (index: number) => {
    if (index === survey.questions.length - 1) return;
    const newQuestions = [...survey.questions];
    [newQuestions[index], newQuestions[index + 1]] = [newQuestions[index + 1], newQuestions[index]];
    setSurvey({ ...survey, questions: newQuestions });
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...survey.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    
    if (field === 'type' && !needsOptions(value as QuestionType)) {
      newQuestions[index].options = [];
    }
    
    setSurvey({ ...survey, questions: newQuestions });
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...survey.questions];
    if (!newQuestions[questionIndex].options) {
      newQuestions[questionIndex].options = [];
    }
    newQuestions[questionIndex].options!.push({ label: '' });
    setSurvey({ ...survey, questions: newQuestions });
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...survey.questions];
    newQuestions[questionIndex].options![optionIndex].label = value;
    setSurvey({ ...survey, questions: newQuestions });
  };

  const deleteOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...survey.questions];
    newQuestions[questionIndex].options = newQuestions[questionIndex].options!.filter((_, i) => i !== optionIndex);
    setSurvey({ ...survey, questions: newQuestions });
  };

  const needsOptions = (type: QuestionType) => 
    type === QuestionType.MULTIPLE_CHOICE_ONE_ANSWER || 
    type === QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWER;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload: any = {
      title: survey.title,
      description: survey.description || undefined,
      questions: survey.questions.map((q) => {
        const question: any = {
          label: q.label,
          type: q.type, 
        };
        
        if (needsOptions(q.type)) {
          if (q.options && q.options.length > 0) {
            question.options = q.options.map((opt) => {
              const option: any = { label: opt.label };
              return option;
            });
          } else {
            question.options = [];
          }
        }
        
        return question;
      }),
    };

    console.log(payload, "payload")
    
    mutation.mutate(payload);
  };

  const getTypeLabel = (type: QuestionType) => {
    switch (type) {
      case QuestionType.OPEN:
        return 'Respuesta abierta';
      case QuestionType.SCALE:
        return 'Escala numérica';
      case QuestionType.MULTIPLE_CHOICE_ONE_ANSWER:
        return 'Opción múltiple (una respuesta)';
      case QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWER:
        return 'Opción múltiple (varias respuestas)';
      default:
        return type;
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={700} mb={3}>
          {'Crear Nueva Encuesta'}
        </Typography>

        {/* Mensajes de éxito y error */}
        {mutation.isSuccess && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => mutation.reset()}>
            ¡Encuesta guardada exitosamente!
          </Alert>
        )}
        
        {mutation.isError && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => mutation.reset()}>
            Error al guardar la encuesta: {mutation.error?.message || 'Intenta nuevamente'}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3} mb={4}>
            <TextField
              label="Título de la encuesta"
              fullWidth
              required
              value={survey.title}
              onChange={(e) => setSurvey({ ...survey, title: e.target.value })}
              placeholder="Ej: Encuesta de Satisfacción del Cliente"
              disabled={mutation.isPending}
            />
            
            <TextField
              label="Descripción (opcional)"
              fullWidth
              multiline
              rows={3}
              value={survey.description}
              onChange={(e) => setSurvey({ ...survey, description: e.target.value })}
              placeholder="Describe el propósito de tu encuesta..."
              disabled={mutation.isPending}
            />
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" fontWeight={600} mb={2}>
            Preguntas
          </Typography>

          {survey.questions.map((question, qIndex) => (
            <Card key={question.id} sx={{ mb: 3, backgroundColor: '#f9f9f9' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Pregunta {qIndex + 1}
                  </Typography>
                  
                  <Box>
                    <IconButton 
                      size="small" 
                      onClick={() => moveQuestionUp(qIndex)}
                      disabled={qIndex === 0 || mutation.isPending}
                      title="Mover arriba"
                    >
                      <ArrowUpward />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => moveQuestionDown(qIndex)}
                      disabled={qIndex === survey.questions.length - 1 || mutation.isPending}
                      title="Mover abajo"
                    >
                      <ArrowDownward />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => deleteQuestion(qIndex)}
                      disabled={mutation.isPending}
                      title="Eliminar pregunta"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>

                <Stack spacing={2}>
                  <TextField
                    label="Texto de la pregunta"
                    fullWidth
                    required
                    value={question.label}
                    onChange={(e) => updateQuestion(qIndex, 'label', e.target.value)}
                    placeholder="Escribe tu pregunta aquí"
                    disabled={mutation.isPending}
                  />

                  <FormControl fullWidth disabled={mutation.isPending}>
                    <InputLabel>Tipo de pregunta</InputLabel>
                    <Select
                      value={question.type}
                      label="Tipo de pregunta"
                      onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
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

                  {needsOptions(question.type) && (
                    <Box sx={{ pl: 2, borderLeft: '3px solid #1976d2', bgcolor: '#e3f2fd', p: 2, borderRadius: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600} mb={1}>
                        Opciones {question.type === QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWER && '(Se pueden seleccionar varias)'}
                      </Typography>
                      
                      {question.options?.map((option, oIndex) => (
                        <Box key={oIndex} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <TextField
                            size="small"
                            fullWidth
                            placeholder={`Opción ${oIndex + 1}`}
                            value={option.label}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            disabled={mutation.isPending}
                          />
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => deleteOption(qIndex, oIndex)}
                            disabled={mutation.isPending}
                            title="Eliminar opción"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      ))}
                      
                      <Button
                        size="small"
                        startIcon={<Add />}
                        onClick={() => addOption(qIndex)}
                        sx={{ mt: 1 }}
                        disabled={mutation.isPending}
                      >
                        Agregar opción
                      </Button>
                      
                      {question.options && question.options.length < 2 && (
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
            onClick={addQuestion}
            fullWidth
            sx={{ mb: 3 }}
            disabled={mutation.isPending}
          >
            Agregar Pregunta
          </Button>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              color="secondary"
              //onClick={onCancel}
              disabled={mutation.isPending}
            >
              Cancelar
            </Button>
            <Button 
              variant="contained" 
              type="submit"
              disabled={!survey.title || survey.questions.length === 0 || mutation.isPending}
              startIcon={mutation.isPending && <CircularProgress size={20} color="inherit" />}
            >
              {mutation.isPending ? 'Guardando...' : 'Crear Encuesta'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}