import * as Yup from 'yup';

enum QuestionType {
  OPEN = 'open',
  SCALE = 'scale',
  MULTIPLE_CHOICE_ONE_ANSWER = 'multiple_choice_one_answer',
  MULTIPLE_CHOICE_MULTIPLE_ANSWER = 'multiple_choice_multiple_answer',
}

interface Question {
  id: number;
  label: string;
  type: QuestionType;
  active: boolean;
  options?: Array<{ id: number; label: string }>;
}

interface Survey {
  id: number;
  title: string;
  description: string;
  active: boolean;
  questions: Question[];
}

export type SurveyFormValues = Record<string, string | number | string[]>;


export const createDynamicSurveyValidation = (survey: Survey) => {
  const shape: Record<string, Yup.AnySchema> = {};

  survey.questions
    .filter(q => q.active)
    .forEach((question) => {
      const fieldName = `question_${question.id}`;

      switch (question.type) {
        case QuestionType.OPEN:
          shape[fieldName] = Yup.string()
            .required(`La pregunta "${question.label}" es obligatoria`)
            .min(3, `La respuesta debe tener al menos 3 caracteres`)
            .max(1000, `La respuesta no puede exceder 1000 caracteres`)
            .trim();
          break;

        case QuestionType.SCALE:
          shape[fieldName] = Yup.number()
            .required(`La pregunta "${question.label}" es obligatoria`)
            .min(1, 'El valor mínimo es 1')
            .max(10, 'El valor máximo es 10')
            .integer('Debe ser un número entero');
          break;

        case QuestionType.MULTIPLE_CHOICE_ONE_ANSWER:
          shape[fieldName] = Yup.string()
            .required(`Debes seleccionar una opción para "${question.label}"`)
            .oneOf(
              question.options?.map(opt => opt.label) || [],
              'Opción inválida'
            );
          break;

        case QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWER:
          shape[fieldName] = Yup.array()
            .of(Yup.string())
            .min(1, `Debes seleccionar al menos una opción para "${question.label}"`)
            .required(`La pregunta "${question.label}" es obligatoria`)
            .test(
              'valid-options',
              'Una o más opciones seleccionadas son inválidas',
              (value) => {
                if (!value) return false;
                const validOptions = question.options?.map(opt => opt.label) || [];
                return value.every((v: any) => validOptions.includes(v));
              }
            );
          break;

        default:
          shape[fieldName] = Yup.mixed().required(`La pregunta "${question.label}" es obligatoria`);
      }
    });

  return Yup.object().shape(shape) as Yup.ObjectSchema<SurveyFormValues>;
};

export const transformToApiFormat = (values: Record<string, any>, survey: Survey) => {
  return survey.questions
    .filter(q => q.active)
    .map((question) => {
      const fieldName = `question_${question.id}`;
      return {
        questionId: question.id,
        answer: values[fieldName],
      };
    });
};

export const getInitialValues = (survey: Survey) => {
  const initialValues: Record<string, any> = {};

  survey.questions
    .filter(q => q.active)
    .forEach((question) => {
      const fieldName = `question_${question.id}`;

      switch (question.type) {
        case QuestionType.OPEN:
          initialValues[fieldName] = '';
          break;

        case QuestionType.SCALE:
          initialValues[fieldName] = 5;
          break;

        case QuestionType.MULTIPLE_CHOICE_ONE_ANSWER:
          initialValues[fieldName] = '';
          break;

        case QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWER:
          initialValues[fieldName] = [];
          break;

        default:
          initialValues[fieldName] = null;
      }
    });

  return initialValues;
};