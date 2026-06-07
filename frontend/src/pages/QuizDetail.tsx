import { Suspense, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Quiz } from '../types'

export function QuizDetail() {
   const { id } = useParams<{ id: string }>()

   const { data: quiz } = useSuspenseQuery({
      queryKey: ['quiz', id],
      queryFn: () => axios.get<Quiz>(`http://localhost:3001/quizzes/${id}`).then((res) => res.data),
   })
   console.log(quiz)

   if (!quiz) return <p className="text-center mt-8 text-red-500">Quiz not found</p>

   return (
      <div className="max-w-3xl mx-auto">
         <div className="bg-white p-8 rounded-lg shadow mb-6">
            <div className="flex justify-between items-center mb-6">
               <h1 className="text-3xl font-bold">{quiz.title}</h1>
               <Link to="/quizzes" className="text-blue-600 hover:underline">
                  Back to Quizzes
               </Link>
            </div>

            <div className="space-y-6">
               <h2 className="text-xl font-semibold border-b border-gray-300 pb-2">Questions ({quiz.questions.length})</h2>

               {quiz.questions.map((q, index) => (
                  <div key={q.id} className="p-4 bg-gray-50 border border-gray-300 rounded-md">
                     <p className="font-medium text-lg mb-3">
                        {index + 1}. {q.text}
                     </p>

                     <div className="pl-4">
                        {q.type === 'boolean' && (
                           <div className="space-y-2">
                              <label className="flex items-center space-x-2">
                                 <input type="radio" disabled className="w-4 h-4 text-blue-600" />
                                 <span>True</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                 <input type="radio" disabled className="w-4 h-4 text-blue-600" />
                                 <span>False</span>
                              </label>
                           </div>
                        )}

                        {q.type === 'input' && (
                           <input
                              type="text"
                              disabled
                              placeholder="Short answer text..."
                              className="w-full max-w-md p-2 border border-gray-300 rounded-md bg-white"
                           />
                        )}

                        {q.type === 'checkbox' && (
                           <div className="space-y-2">
                              {q.options?.split(',').map((opt, i) => (
                                 <label key={i} className="flex items-center space-x-2">
                                    <input type="checkbox" disabled className="w-4 h-4 text-blue-600 rounded" />
                                    <span>{opt.trim()}</span>
                                 </label>
                              ))}
                           </div>
                        )}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}
