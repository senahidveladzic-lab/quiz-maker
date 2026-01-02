export interface Question {
  id: string;
  text: string;
  answer: string;
}

export interface Quiz {
  id: string;
  name: string;
  questionIds: string[];
  createdAt: string;
}

export interface QuizCreateDto {
  name: string;
  questionIds: string[];
}

export interface QuestionCreateDto {
  text: string;
  answer: string;
}

export interface QuizWithQuestions extends Quiz {
  questions: Question[];
}
