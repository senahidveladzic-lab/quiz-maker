"use client";

import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Question } from "@/lib/types";

interface QuestionAutocompleteProps {
  availableQuestions: Question[];
  onSelect: (question: Question) => void;
  isLoading?: boolean;
}

export function QuestionAutocomplete({
  availableQuestions,
  onSelect,
  isLoading = false,
}: QuestionAutocompleteProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          Select existing questions to recycle...
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search questions..." />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Loading..." : "No questions found."}
            </CommandEmpty>
            <CommandGroup>
              {availableQuestions.map((question) => (
                <CommandItem
                  key={question.id}
                  value={question.text}
                  onSelect={() => {
                    onSelect(question);
                    setOpen(false);
                  }}
                >
                  <div className="flex-1">
                    <div className="font-medium">{question.text}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {question.answer}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
