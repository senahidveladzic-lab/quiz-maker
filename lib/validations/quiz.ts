import { z } from "zod";

export const createQuizSchema = z
  .object({
    name: z
      .string()
      .min(1, "Quiz name is required")
      .min(3, "Quiz name must be at least 3 characters")
      .max(100, "Quiz name must be less than 100 characters"),
    newQuestions: z.array(
      z.object({
        text: z
          .string()
          .min(1, "Question text is required")
          .min(5, "Question must be at least 5 characters"),
        answer: z
          .string()
          .min(1, "Answer is required")
          .min(3, "Answer must be at least 3 characters"),
      }),
    ),
    existingQuestionIds: z.array(z.string()),
  })
  .refine(
    (data) =>
      data.newQuestions.length > 0 || data.existingQuestionIds.length > 0,
    {
      message: "At least one question is required (new or existing)",
      path: ["newQuestions"],
    },
  );

export const editQuizSchema = z
  .object({
    name: z
      .string()
      .min(1, "Quiz name is required")
      .min(3, "Quiz name must be at least 3 characters")
      .max(100, "Quiz name must be less than 100 characters"),
    existingQuestions: z.array(
      z.object({
        id: z.string(),
        text: z
          .string()
          .min(1, "Question text is required")
          .min(5, "Question must be at least 5 characters"),
        answer: z
          .string()
          .min(1, "Answer is required")
          .min(3, "Answer must be at least 3 characters"),
        isModified: z.boolean(),
      }),
    ),
    newQuestions: z.array(
      z.object({
        text: z
          .string()
          .min(1, "Question text is required")
          .min(5, "Question must be at least 5 characters"),
        answer: z
          .string()
          .min(1, "Answer is required")
          .min(3, "Answer must be at least 3 characters"),
      }),
    ),
    recycledQuestionIds: z.array(z.string()),
  })
  .refine(
    (data) =>
      data.existingQuestions.length > 0 ||
      data.newQuestions.length > 0 ||
      data.recycledQuestionIds.length > 0,
    {
      message: "At least one question is required",
      path: ["existingQuestions"],
    },
  );

export type CreateQuizFormData = z.infer<typeof createQuizSchema>;
export type EditQuizFormData = z.infer<typeof editQuizSchema>;
