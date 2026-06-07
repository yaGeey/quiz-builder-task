import express from 'express'
import cors from 'cors'
import { z } from 'zod'
import { prisma } from './prisma'

const app = express()

app.use(cors())
app.use(express.json())

const questionSchema = z.discriminatedUnion('type', [
   z.object({
      type: z.literal('boolean'),
      text: z.string().min(1),
      answers: z.enum(['true', 'false']),
   }),
   z.object({
      type: z.literal('input'),
      text: z.string().min(1),
      answers: z.string().optional().nullable(),
   }),
   z.object({
      type: z.literal('checkbox'),
      text: z.string().min(1),
      options: z.array(z.object({ value: z.string().min(1) })).min(2),
      answers: z.string().min(1),
   }),
])

const quizSchema = z.object({
   title: z.string().min(1),
   questions: z.array(questionSchema).min(1),
})

app.get('/quizzes', async (req, res) => {
   try {
      const quizzes = await prisma.quiz.findMany({
         include: {
            _count: {
               select: { questions: true },
            },
         },
      })
      res.json(quizzes)
   } catch (error) {
      res.status(500).json({ error: String(error) })
   }
})

app.get('/quizzes/:id', async (req, res) => {
   const id = parseInt(req.params.id)
   try {
      const quiz = await prisma.quiz.findUnique({
         where: { id },
         include: { questions: true },
      })
      if (!quiz) return res.status(404).json({ error: 'Quiz not found' })
      res.json(quiz)
   } catch (error) {
      res.status(500).json({ error: String(error) })
   }
})

app.post('/quizzes', async (req, res) => {
   try {
      const data = quizSchema.parse(req.body)

      const formattedQuestions = data.questions.map((q) => {
         if (q.type === 'checkbox') {
            return {
               type: q.type,
               text: q.text,
               options: q.options.map((opt) => opt.value).join(', '),
               answers: q.answers,
            }
         }
         return {
            type: q.type,
            text: q.text,
            options: null,
            answers: q.answers || null,
         }
      })

      const newQuiz = await prisma.quiz.create({
         data: {
            title: data.title,
            questions: {
               create: formattedQuestions,
            },
         },
         include: { questions: true },
      })
      res.status(201).json(newQuiz)
   } catch (error) {
      console.error(error)
      res.status(400).json({ error: 'Invalid data' })
   }
})

app.delete('/quizzes/:id', async (req, res) => {
   const id = parseInt(req.params.id)
   try {
      await prisma.quiz.delete({ where: { id } })
      res.json({ success: true })
   } catch (error) {
      res.status(500).json({ error: String(error) })
   }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
   console.log('Server is running at http://localhost:' + PORT)
})
