import { useFieldArray, useWatch, Control, UseFormRegister } from 'react-hook-form'

import { Plus, Trash2 } from 'lucide-react'
import { QuizFormValues } from '../types'

type NestedOptionsProps = {
   index: number
   control: Control<QuizFormValues>
   register: UseFormRegister<QuizFormValues>
   errors: any
   setValue: any
}
export default function NestedOptions({ index, control, register, errors, setValue }: NestedOptionsProps) {
   const { fields, append, remove } = useFieldArray({
      control,
      name: `questions.${index}.options` as any,
   })

   const currentOptions =
      useWatch({
         control,
         name: `questions.${index}.options`,
      }) || []

   const currentAnswersString =
      useWatch({
         control,
         name: `questions.${index}.answers`,
      }) || ''

   const currentAnswers = currentAnswersString
      .split(',')
      .map((a: string) => a.trim())
      .filter(Boolean)

   const handleCheckboxChange = (optionValue: string, checked: boolean) => {
      let newAnswers = [...currentAnswers]
      if (checked) {
         if (!newAnswers.includes(optionValue)) {
            newAnswers.push(optionValue)
         }
      } else {
         newAnswers = newAnswers.filter((a) => a !== optionValue)
      }
      setValue(`questions.${index}.answers`, newAnswers.join(', '), { shouldValidate: true })
   }

   return (
      <div className="space-y-4 bg-white p-5 border border-gray-200 rounded-lg shadow-inner">
         <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Answer Options</span>
            <button
               type="button"
               onClick={() => append({ value: '' })}
               className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center space-x-1 py-1 px-2 rounded-md hover:bg-blue-50 transition-colors"
            >
               <Plus size={14} /> <span>Add Option</span>
            </button>
         </div>

         <div className="space-y-2">
            {fields.map((field, optIndex) => (
               <div key={field.id} className="flex items-center space-x-2">
                  <input
                     {...register(`questions.${index}.options.${optIndex}.value` as any)}
                     className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                     placeholder={`Option ${optIndex + 1}`}
                  />
                  {fields.length > 2 && (
                     <button
                        type="button"
                        onClick={() => {
                           const removedValue = currentOptions[optIndex]?.value
                           if (removedValue) {
                              const newAnswers = currentAnswers.filter((a: string) => a !== removedValue)
                              setValue(`questions.${index}.answers`, newAnswers.join(', '))
                           }
                           remove(optIndex)
                        }}
                        className="text-gray-400 hover:text-red-500 p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                     >
                        <Trash2 size={16} />
                     </button>
                  )}
               </div>
            ))}
         </div>

         {errors.questions?.[index]?.options && (
            <p className="text-red-600 text-xs mt-1">{errors.questions[index]?.options?.message}</p>
         )}

         <div className="pt-3 border-t border-gray-100 space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Select Correct Answers</label>

            <div className="space-y-2 bg-gray-50/50 p-3 rounded-lg border border-gray-200">
               {currentOptions.map((opt: any, optIndex: number) => {
                  const optionValue = opt.value?.trim()
                  const isOptionEmpty = !optionValue
                  const isChecked = !isOptionEmpty && currentAnswers.includes(optionValue)

                  return (
                     <label
                        key={optIndex}
                        className={`flex items-center space-x-3 text-sm p-1.5 rounded transition-colors ${
                           isOptionEmpty ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'
                        }`}
                     >
                        <input
                           type="checkbox"
                           disabled={isOptionEmpty}
                           checked={isChecked}
                           onChange={(e) => handleCheckboxChange(optionValue, e.target.checked)}
                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all"
                        />
                        <span className={isOptionEmpty ? 'text-gray-400 italic' : 'text-gray-700'}>
                           {isOptionEmpty ? `Fill option ${optIndex + 1} first` : optionValue}
                        </span>
                     </label>
                  )
               })}
            </div>

            {errors.questions?.[index] && 'answers' in errors.questions[index]! && (
               <p className="text-red-600 text-xs mt-1">{(errors.questions[index] as any).answers?.message}</p>
            )}
         </div>
      </div>
   )
}
