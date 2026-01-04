import { z } from "zod";

export const quizFormSchema = z
  .object({
    name: z
      .string()
      .min(1, "Quiz name is required")
      .min(3, "Quiz name must be at least 3 characters")
      .max(100, "Quiz name must be less than 100 characters"),
    questions: z.array(
      z.object({
        id: z.string().optional(),
        text: z
          .string()
          .min(1, "Question text is required")
          .min(5, "Question must be at least 5 characters"),
        answer: z
          .string()
          .min(1, "Answer is required")
          .min(3, "Answer must be at least 3 characters"),
        isCollapsed: z.boolean(),
        tempId: z.string(),
      }),
    ),
  })
  .refine((data) => data.questions.length > 0, {
    message: "At least one question is required",
    path: ["questions"],
  });
