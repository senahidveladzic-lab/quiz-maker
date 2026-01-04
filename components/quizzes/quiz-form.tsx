"use client";

import { Loader2, Plus, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { QuizQuestion, UseQuizFormReturn } from "@/lib/types";
import { QuestionAutocomplete } from "./question-autocomplete";
import { ReusableDialog } from "@/components/common/reusable-dialog";
import { SortableQuestion } from "./sortable-question";

interface QuizFormProps {
  title: string;
  description: string;
  submitText: string;
  formData: UseQuizFormReturn;
}

export function QuizForm({
  title,
  description,
  submitText,
  formData,
}: QuizFormProps) {
  const router = useRouter();
  const {
    form,
    availableQuestions,
    isLoadingQuestions,
    questions,
    totalQuestions,
    isSubmitting,
    onSubmit,
    addNewQuestion,
    removeQuestion,
    confirmRemoveQuestion,
    addRecycledQuestion,
    toggleCollapse,
    reorderQuestions,
    deleteQuestionDialog,
    setDeleteQuestionDialog,
  } = formData;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.tempId === active.id);
      const newIndex = questions.findIndex((q) => q.tempId === over.id);

      const newOrder = arrayMove(questions, oldIndex, newIndex);
      reorderQuestions(newOrder);
    }
  };

  const getQuestionPreview = (question: QuizQuestion | null): string => {
    if (!question) return "";
    const text = question.text || "Empty question";
    return text.length > 50 ? text.substring(0, 50) + "..." : text;
  };

  return (
    <section className="min-h-screen bg-background">
      <div className="container mx-auto py-10 max-w-4xl px-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Quizzes
        </Button>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            {description}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Quiz Name */}
            <Card>
              <CardHeader>
                <CardTitle>Quiz Name</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
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

            {/* Autocomplete for Recycling Questions */}
            <Card>
              <CardHeader>
                <CardTitle>Recycle Existing Questions</CardTitle>
                <FormDescription>
                  Select questions from previous quizzes to include in this one
                </FormDescription>
              </CardHeader>
              <CardContent>
                {availableQuestions.length === 0 && !isLoadingQuestions ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No existing questions available to recycle.
                  </div>
                ) : (
                  <QuestionAutocomplete
                    availableQuestions={availableQuestions}
                    onSelect={addRecycledQuestion}
                    isLoading={isLoadingQuestions}
                  />
                )}
              </CardContent>
            </Card>
            {/* Questions List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Questions</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addNewQuestion}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Question
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {questions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No questions added yet. Add a new question or recycle an
                    existing one.
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={questions.map((q) => q.tempId)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-4">
                        {questions.map((question, index) => (
                          <SortableQuestion
                            key={question.tempId}
                            question={question}
                            index={index}
                            control={form.control}
                            onRemove={removeQuestion}
                            onToggleCollapse={toggleCollapse}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </CardContent>
            </Card>

            {/* Summary and Submit */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                      className="flex-1"
                      onClick={() => router.push("/")}
                      disabled={isSubmitting}
                      size="lg"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="lg"
                      className="flex-1"
                    >
                      {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {submitText}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>

        <ReusableDialog
          open={deleteQuestionDialog.open}
          onOpenChange={(open) =>
            setDeleteQuestionDialog({
              open,
              questionToDelete: open
                ? deleteQuestionDialog.questionToDelete
                : null,
            })
          }
          variant="danger"
          title="Delete Question"
          description={`Are you sure you want to delete "${getQuestionPreview(deleteQuestionDialog.questionToDelete)}"?`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmRemoveQuestion}
        />
      </div>
    </section>
  );
}
