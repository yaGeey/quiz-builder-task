import { Link } from 'react-router-dom'
import axios from 'axios'
import { Trash2 } from 'lucide-react'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

interface Quiz {
   id: number
   title: string
   createdAt: string
   updatedAt: string
   _count: {
      questions: number
   }
}

export function QuizList() {
   const queryClient = useQueryClient()

   const { data: quizzes } = useSuspenseQuery({
      queryKey: ['quizzes'],
      queryFn: () => axios<Quiz[]>('http://localhost:3001/quizzes').then((res) => res.data),
   })

   const mutation = useMutation({
      mutationFn: (id: number) => axios.delete(`http://localhost:3001/quizzes/${id}`),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['quizzes'] })
      },
   })

   const deleteQuiz = async (id: number) => {
      if (!confirm('Are you sure you want to delete this quiz?')) return
      try {
         mutation.mutate(id)
      } catch (error) {
         console.error('Failed to delete quiz', error)
      }
   }

   return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <h1 className="text-3xl font-bold text-gray-900 mb-8">All Quizzes</h1>

         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.length === 0 && (
               <p className="text-gray-500 col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                  No quizzes available. Create one!
               </p>
            )}

            {quizzes.map((quiz) => (
               <div
                  key={quiz.id}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
               >
                  <div className="flex justify-between items-start gap-4">
                     <Link to={`/quizzes/${quiz.id}`} className="block flex-1 group">
                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-150 mb-2">
                           {quiz.title}
                        </h2>
                        <div className="flex flex-col space-y-1">
                           <p className="text-sm font-medium text-gray-400">{quiz._count.questions} Questions</p>
                           <p className="text-xs text-gray-400">Created: {new Date(quiz.createdAt).toLocaleDateString()}</p>
                        </div>
                     </Link>

                     <button
                        onClick={(e) => {
                           e.preventDefault()
                           deleteQuiz(quiz.id)
                        }}
                        className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors duration-150 shrink-0"
                     >
                        <Trash2 size={20} />
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </div>
   )
}
