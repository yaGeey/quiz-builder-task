import z from 'zod'
export const baseQuestionSchema = z.object({
   text: z.string().min(1, 'Question text is required'),
})

export const questionSchema = z.discriminatedUnion('type', [
   baseQuestionSchema.extend({
      type: z.literal('boolean'),
      answers: z.enum(['true', 'false']),
   }),
   baseQuestionSchema.extend({
      type: z.literal('input'),
      answers: z.string().min(1, 'Correct answer text is required'),
   }),
   baseQuestionSchema.extend({
      type: z.literal('checkbox'),
      options: z.array(z.object({ value: z.string().min(1, 'Option cannot be empty') })).min(2, 'Provide at least 2 options'),
      answers: z.string().min(1, 'At least one correct answer must be selected'),
   }),
])

export const quizSchema = z.object({
   title: z.string().min(1, 'Title is required'),
   questions: z.array(questionSchema).min(1, 'At least one question is required'),
})

export type QuizFormValues = z.infer<typeof quizSchema>

export type Question = {
   id: number
   type: string
   text: string
   options: string | null
   answers: string | null
}

export type Quiz = {
   id: number
   title: string
   questions: Question[]
}
