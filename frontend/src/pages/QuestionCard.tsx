import { useWatch, Control, UseFormRegister, FieldErrors } from 'react-hook-form'
import { Trash2 } from 'lucide-react'
import { QuizFormValues } from '../types'
import NestedOptions from './NestedOptions'

type QuestionCardProps = {
   index: number
   control: Control<QuizFormValues>
   register: UseFormRegister<QuizFormValues>
   errors: FieldErrors<QuizFormValues>
   remove: (index: number) => void
   setValue: any
}
export default function QuestionCard({ index, control, register, errors, remove, setValue }: QuestionCardProps) {
   const type = useWatch({
      control,
      name: `questions.${index}.type`,
   })

   return (
      <div className="p-6 border border-gray-200 rounded-xl relative bg-gray-50/50 shadow-sm hover:shadow-md transition-shadow duration-200">
         <button
            type="button"
            onClick={() => remove(index)}
            className="absolute top-6 right-6 text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors duration-200"
         >
            <Trash2 size={18} />
         </button>

         <div className="space-y-4 pr-8">
            <div>
               <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Question Type</label>
               <select
                  {...register(`questions.${index}.type` as any)}
                  className="w-full bg-white border border-gray-300 rounded-lg shadow-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  onChange={(e) => {
                     register(`questions.${index}.type` as any).onChange(e)
                     setValue(`questions.${index}.answers`, e.target.value === 'boolean' ? 'true' : '')
                     setValue(
                        `questions.${index}.options`,
                        e.target.value === 'checkbox' ? [{ value: '' }, { value: '' }] : undefined,
                     )
                  }}
               >
                  <option value="boolean">True / False</option>
                  <option value="input">Short Answer</option>
                  <option value="checkbox">Multiple Choice</option>
               </select>
            </div>

            <div>
               <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Question Text</label>
               <input
                  {...register(`questions.${index}.text` as any)}
                  className="w-full bg-white border border-gray-300 rounded-lg shadow-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="What is the capital of Ukraine?"
               />
               {errors.questions?.[index]?.text && (
                  <p className="text-red-600 text-xs mt-1.5 flex items-center">{errors.questions[index]?.text?.message}</p>
               )}
            </div>

            {type === 'checkbox' && (
               <NestedOptions index={index} control={control} register={register} errors={errors} setValue={setValue} />
            )}

            {type === 'boolean' && (
               <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                     Correct Answer
                  </label>
                  <select
                     {...register(`questions.${index}.answers` as any)}
                     className="w-full bg-white border border-gray-300 rounded-lg shadow-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                     <option value="true">True</option>
                     <option value="false">False</option>
                  </select>
               </div>
            )}

            {type === 'input' && (
               <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                     Correct Answer
                  </label>
                  <input
                     {...register(`questions.${index}.answers` as any)}
                     className="w-full bg-white border border-gray-300 rounded-lg shadow-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                     placeholder="Kyiv"
                  />
                  {errors.questions?.[index] && 'answers' in errors.questions[index]! && (
                     <p className="text-red-600 text-xs mt-1.5">{(errors.questions[index] as any).answers?.message}</p>
                  )}
               </div>
            )}
         </div>
      </div>
   )
}
