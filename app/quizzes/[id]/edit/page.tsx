"use client";

import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import { editQuizSchema, type EditQuizFormData } from "@/lib/validations/quiz";
import {
  useQuiz,
  useQuestionsByIds,
  useUpdateQuiz,
  useCreateQuestion,
  useUpdateQuestion,
  useQuestions,
  useQuizzes,
} from "@/lib/api";
import { QuestionCard } from "@/components/quizzes/question-card";
import { QuestionEditDialog } from "@/components/quizzes/question-edit-dialog";

export default function EditQuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const { data: quiz, isLoading: loadingQuiz } = useQuiz(quizId);
  const { data: quizQuestions, isLoading: loadingQuestions } =
    useQuestionsByIds(quiz?.questionIds || []);
  const { data: allQuestions, isLoading: loadingAllQuestions } = useQuestions();
  const { data: existingQuizzes } = useQuizzes();

  const updateQuizMutation = useUpdateQuiz();
  const createQuestionMutation = useCreateQuestion();
  const updateQuestionMutation = useUpdateQuestion();

  const [editStrategyDialog, setEditStrategyDialog] = useState<{
    open: boolean;
    questionIndex: number | null;
    originalQuestion: { id: string; text: string; answer: string } | null;
  }>({
    open: false,
    questionIndex: null,
    originalQuestion: null,
  });

  const form = useForm<EditQuizFormData>({
    resolver: zodResolver(editQuizSchema),
    defaultValues: {
      name: "",
      existingQuestions: [],
      newQuestions: [],
      recycledQuestionIds: [],
    },
  });

  // Load quiz data into form
  useEffect(() => {
    if (quiz && quizQuestions) {
      form.reset({
        name: quiz.name,
        existingQuestions: quizQuestions.map((q) => ({
          id: q.id,
          text: q.text,
          answer: q.answer,
          isModified: false,
        })),
        newQuestions: [],
        recycledQuestionIds: [],
      });
    }
  }, [quiz, quizQuestions, form]);

  const existingQuestions = form.watch("existingQuestions");
  const newQuestions = form.watch("newQuestions");
  const recycledQuestionIds = form.watch("recycledQuestionIds");

  // Check if question text or answer has changed
  const checkIfQuestionModified = (index: number) => {
    const current = existingQuestions[index];
    const original = quizQuestions?.find((q) => q.id === current.id);

    if (!original) return;

    const isModified =
      current.text !== original.text || current.answer !== original.answer;

    if (isModified && !current.isModified) {
      // First time detecting modification, show strategy dialog
      setEditStrategyDialog({
        open: true,
        questionIndex: index,
        originalQuestion: original,
      });
    }
  };

  const handleUpdateGlobally = () => {
    if (editStrategyDialog.questionIndex === null) return;

    const updatedQuestions = [...existingQuestions];
    updatedQuestions[editStrategyDialog.questionIndex].isModified = true;
    form.setValue("existingQuestions", updatedQuestions);
  };

  const handleCreateNewVersion = () => {
    if (editStrategyDialog.questionIndex === null) return;

    const questionToConvert =
      existingQuestions[editStrategyDialog.questionIndex];

    // Remove from existing questions
    const updatedExisting = existingQuestions.filter(
      (_, i) => i !== editStrategyDialog.questionIndex,
    );
    form.setValue("existingQuestions", updatedExisting);

    // Add to new questions
    const updatedNew = [
      ...newQuestions,
      { text: questionToConvert.text, answer: questionToConvert.answer },
    ];
    form.setValue("newQuestions", updatedNew);
  };

  const addNewQuestion = () => {
    form.setValue("newQuestions", [...newQuestions, { text: "", answer: "" }]);
  };

  const removeExistingQuestion = (index: number) => {
    form.setValue(
      "existingQuestions",
      existingQuestions.filter((_, i) => i !== index),
    );
  };

  const removeNewQuestion = (index: number) => {
    form.setValue(
      "newQuestions",
      newQuestions.filter((_, i) => i !== index),
    );
  };

  const toggleRecycledQuestion = (questionId: string) => {
    if (recycledQuestionIds.includes(questionId)) {
      form.setValue(
        "recycledQuestionIds",
        recycledQuestionIds.filter((id) => id !== questionId),
      );
    } else {
      form.setValue("recycledQuestionIds", [
        ...recycledQuestionIds,
        questionId,
      ]);
    }
  };

  // Get available questions for recycling (exclude already used ones)
  const availableForRecycling = allQuestions?.filter(
    (q) =>
      !existingQuestions.some((eq) => eq.id === q.id) &&
      !recycledQuestionIds.includes(q.id),
  );

  const onSubmit = async (data: EditQuizFormData) => {
    // Check for duplicate quiz name (excluding current quiz)
    const isDuplicate = existingQuizzes?.some(
      (q) =>
        q.id !== quizId && q.name.toLowerCase() === data.name.toLowerCase(),
    );

    if (isDuplicate) {
      form.setError("name", {
        type: "manual",
        message: "A quiz with this name already exists",
      });
      return;
    }

    try {
      const finalQuestionIds: string[] = [];

      // Handle existing questions
      for (const question of data.existingQuestions) {
        if (question.isModified) {
          // Update globally
          await updateQuestionMutation.mutateAsync({
            id: question.id,
            data: { text: question.text, answer: question.answer },
          });
        }
        finalQuestionIds.push(question.id);
      }

      // Create new questions
      for (const question of data.newQuestions) {
        const created = await createQuestionMutation.mutateAsync(question);
        finalQuestionIds.push(created.id);
      }

      // Add recycled questions
      finalQuestionIds.push(...data.recycledQuestionIds);

      // Update the quiz
      await updateQuizMutation.mutateAsync({
        id: quizId,
        data: {
          name: data.name,
          questionIds: finalQuestionIds,
        },
      });

      toast.success("Quiz updated successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to update quiz. Please try again.");
      console.error("Error updating quiz:", error);
    }
  };

  const isSubmitting =
    updateQuizMutation.isPending ||
    createQuestionMutation.isPending ||
    updateQuestionMutation.isPending;

  const totalQuestions =
    existingQuestions.length + newQuestions.length + recycledQuestionIds.length;

  if (loadingQuiz || loadingQuestions) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Quiz Not Found</h2>
          <Button onClick={() => router.push("/")}>Back to Quizzes</Button>
        </div>
      </div>
    );
  }

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
          <h1 className="text-4xl font-bold tracking-tight">Edit Quiz</h1>
          <p className="text-muted-foreground mt-2">
            Update your quiz name and questions
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

            {/* Existing Questions */}
            <Card>
              <CardHeader>
                <CardTitle>Current Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {existingQuestions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No questions in this quiz. Add some below!
                  </div>
                ) : (
                  existingQuestions.map((_, index) => (
                    <QuestionCard
                      key={index}
                      index={index}
                      control={form.control}
                      onRemove={removeExistingQuestion}
                      namePrefix="existingQuestions"
                      isExistingQuestion={true}
                      onEditExisting={() => checkIfQuestionModified(index)}
                    />
                  ))
                )}
              </CardContent>
            </Card>

            {/* New Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Add New Questions</span>
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
                    No new questions added yet. Click "Add Question" to create
                    one.
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

            {/* Recycled Questions */}
            <Card>
              <CardHeader>
                <CardTitle>Add Existing Questions</CardTitle>
                <FormDescription>
                  Select questions from other quizzes to include in this one
                </FormDescription>
              </CardHeader>
              <CardContent>
                {loadingAllQuestions ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading questions...
                  </div>
                ) : !availableForRecycling ||
                  availableForRecycling.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No other questions available for recycling.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availableForRecycling.map((question) => (
                      <div
                        key={question.id}
                        className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          id={question.id}
                          checked={recycledQuestionIds.includes(question.id)}
                          onCheckedChange={() =>
                            toggleRecycledQuestion(question.id)
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
                      Update Quiz
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>

        <QuestionEditDialog
          open={editStrategyDialog.open}
          onOpenChange={(open) =>
            setEditStrategyDialog((prev) => ({ ...prev, open }))
          }
          onUpdateGlobally={handleUpdateGlobally}
          onCreateNew={handleCreateNewVersion}
          questionText={editStrategyDialog.originalQuestion?.text || ""}
        />
      </div>
    </div>
  );
}
