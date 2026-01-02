"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import {
  createQuizSchema,
  type CreateQuizFormData,
} from "@/lib/validations/quiz";
import {
  useCreateQuiz,
  useCreateQuestion,
  useQuestions,
  useQuizzes,
} from "@/lib/api";
import { QuestionCard } from "@/components/quizzes/question-card";

export default function CreateQuizPage() {
  const router = useRouter();
  const createQuizMutation = useCreateQuiz();
  const createQuestionMutation = useCreateQuestion();
  const { data: existingQuestions, isLoading: loadingQuestions } =
    useQuestions();
  const { data: existingQuizzes } = useQuizzes();

  const form = useForm<CreateQuizFormData>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      name: "",
      newQuestions: [],
      existingQuestionIds: [],
    },
  });

  const newQuestions = form.watch("newQuestions");
  const selectedExistingIds = form.watch("existingQuestionIds");

  const addNewQuestion = () => {
    const current = form.getValues("newQuestions");
    form.setValue("newQuestions", [...current, { text: "", answer: "" }]);
  };

  const removeNewQuestion = (index: number) => {
    const current = form.getValues("newQuestions");
    form.setValue(
      "newQuestions",
      current.filter((_, i) => i !== index),
    );
  };

  const toggleExistingQuestion = (questionId: string) => {
    const current = form.getValues("existingQuestionIds");
    if (current.includes(questionId)) {
      form.setValue(
        "existingQuestionIds",
        current.filter((id) => id !== questionId),
      );
    } else {
      form.setValue("existingQuestionIds", [...current, questionId]);
    }
  };

  const onSubmit = async (data: CreateQuizFormData) => {
    // Check for duplicate quiz name
    const isDuplicate = existingQuizzes?.some(
      (quiz) => quiz.name.toLowerCase() === data.name.toLowerCase(),
    );

    if (isDuplicate) {
      form.setError("name", {
        type: "manual",
        message: "A quiz with this name already exists",
      });
      return;
    }

    try {
      // Create new questions first
      const createdQuestionIds: string[] = [];
      for (const question of data.newQuestions) {
        const created = await createQuestionMutation.mutateAsync(question);
        createdQuestionIds.push(created.id);
      }

      // Combine new and existing question IDs
      const allQuestionIds = [
        ...createdQuestionIds,
        ...data.existingQuestionIds,
      ];

      // Create the quiz
      await createQuizMutation.mutateAsync({
        name: data.name,
        questionIds: allQuestionIds,
      });

      toast.success("Quiz created successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to create quiz. Please try again.");
      console.error("Error creating quiz:", error);
    }
  };

  const isSubmitting =
    createQuizMutation.isPending || createQuestionMutation.isPending;

  const totalQuestions = newQuestions.length + selectedExistingIds.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-10 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Quizzes
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Create New Quiz</h1>
          <p className="text-muted-foreground mt-2">
            Add a name and questions to create your quiz
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Quiz Name */}
            <Card>
              <CardHeader>
                <CardTitle>Quiz Details</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quiz Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., JavaScript Basics Quiz"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Give your quiz a descriptive name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* New Questions Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>New Questions</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addNewQuestion}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Question
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {newQuestions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No new questions added yet. Click &#34;Add Question&#34; to
                    create one.
                  </div>
                ) : (
                  newQuestions.map((_, index) => (
                    <QuestionCard
                      key={index}
                      index={index}
                      control={form.control}
                      onRemove={removeNewQuestion}
                      namePrefix="newQuestions"
                    />
                  ))
                )}
              </CardContent>
            </Card>

            {/* Existing Questions Section */}
            <Card>
              <CardHeader>
                <CardTitle>Recycle Existing Questions</CardTitle>
                <FormDescription>
                  Select questions from previous quizzes to include in this one
                </FormDescription>
              </CardHeader>
              <CardContent>
                {loadingQuestions ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading questions...
                  </div>
                ) : !existingQuestions || existingQuestions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No existing questions available yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {existingQuestions.map((question) => (
                      <div
                        key={question.id}
                        className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          id={question.id}
                          checked={selectedExistingIds.includes(question.id)}
                          onCheckedChange={() =>
                            toggleExistingQuestion(question.id)
                          }
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-1">
                          <label
                            htmlFor={question.id}
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            {question.text}
                          </label>
                          <p className="text-sm text-muted-foreground">
                            {question.answer}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Summary and Submit */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Total Questions</p>
                    <p className="text-2xl font-bold">{totalQuestions}</p>
                    {totalQuestions === 0 && (
                      <p className="text-sm text-destructive">
                        At least one question is required
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/")}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} size="lg">
                      {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Create Quiz
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
