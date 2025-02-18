export type Question = {
  id: string;
  name: string;
  attribute: string;
  type: QuestionType;
  choices: Choice[];
};

export type Choice = {
  id: string;
  name: string;
};

export type QuestionType =
  | "textArea"
  | "jwtToken"
  | "dropDownList"
  | "checkboxList"
  | "radioList"
  | "email"
  | "textInput"
  | "donation"
  | "phone"
  | "date"
  | "heading"
  | "emailDomain";

export const AcceptedQuestionTypeArray = [
  "dropDownList",
  "checkboxList",
  "radioList",
  "emailDomain",
  "email",
] as const;

export type AcceptedQuestionType = (typeof AcceptedQuestionTypeArray)[number];
