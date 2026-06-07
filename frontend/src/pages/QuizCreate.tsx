import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { QuizFormValues, quizSchema } from '../types'
import QuestionCard from '../components/QuestionCard'

export function QuizCreate() {
   const navigate = useNavigate()

   const {
      register,
      control,
      handleSubmit,
      setValue,
      formState: { errors },
   } = useForm<QuizFormValues>({
      resolver: zodResolver(quizSchema),
      defaultValues: {
         title: '',
         questions: [{ type: 'boolean', text: '', answers: 'true' }],
      },
   })

   const { fields, append, remove } = useFieldArray({
      control,
      name: 'questions',
   })

   const { mutate, isPending } = useMutation({
      mutationFn: async (data: QuizFormValues) => {
         return axios.post('http://localhost:3001/quizzes', data)
      },
      onSuccess: () => {
         navigate('/quizzes')
      },
      onError: (error) => {
         console.error('Failed to create quiz', error)
         alert('Error creating quiz')
      },
   })

   return (
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100 my-10">
         <div className="border-b border-gray-100 pb-5 mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create New Quiz</h1>
            <p className="text-sm text-gray-500 mt-1">Design your quiz, add dynamic questions and setup validation parameters.</p>
         </div>

         <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-8">
            <div>
               <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Quiz Title</label>
               <input
                  {...register('title')}
                  className="w-full border-gray-300 rounded-lg shadow-sm px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-150"
                  placeholder="E.g., React Hooks Advanced Certification"
               />
               {errors.title && <p className="text-red-600 text-xs mt-1.5">{errors.title.message}</p>}
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <h2 className="text-lg font-bold text-gray-800">Questions Base</h2>
                  <button
                     type="button"
                     onClick={() => append({ type: 'boolean', text: '', answers: 'true' })}
                     className="flex items-center space-x-1 text-sm font-semibold bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 active:bg-blue-200 transition-all duration-150"
                  >
                     <Plus size={16} /> <span>Add Question</span>
                  </button>
               </div>

               {errors.questions && <p className="text-red-600 text-xs font-medium">{errors.questions.message}</p>}

               <div className="space-y-5">
                  {fields.map((field, index) => (
                     <QuestionCard
                        key={field.id}
                        index={index}
                        control={control}
                        register={register}
                        errors={errors}
                        remove={remove}
                        setValue={setValue}
                     />
                  ))}
               </div>
            </div>

            <div className="pt-4">
               <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed shadow-sm hover:shadow transition-all duration-150"
               >
                  {isPending ? 'Saving Instance...' : 'Save Quiz Configuration'}
               </button>
            </div>
         </form>
      </div>
   )
}
