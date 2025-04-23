import { createContext } from "react";

export type TestAnswerType = {
  id: number;
  descr: string;
}
export type TestQuestionType = {
  id: number;
  descr: string;
  answers: TestAnswerType[];
}
export type ActiveTestType = {
  data: TestQuestionType[];
  schedule_end: string;
  schedule_start: string;
  test_id: number;
  title: string;
  subtitle: string;
  schedule_type: string;
  schedule_id: number;
  finished: boolean;
};
export type ActiveTestWrapperType = {
  activetest: ActiveTestType;
};
export const TestpageContext = createContext<ActiveTestWrapperType | null>(null);
