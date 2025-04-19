/**
 * Тип для варианта ответа на вопрос квиза (из API)
 */
export interface Answer {
  id: number;
  text: string;
  order: number;
}

/**
 * Тип для вопроса квиза (из API)
 */
export interface Question {
  id: number;
  text: string;
  order: number;
  answers: Answer[]; // Вложенные ответы
}

/**
 * Тип для квиза (из API)
 */
export interface Quiz {
  id: number;
  title: string;
  slug: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  questions: Question[]; // Вложенные вопросы
} 