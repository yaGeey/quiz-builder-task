import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { QuizList } from './pages/QuizList'
import { QuizCreate } from './pages/QuizCreate'
import { QuizDetail } from './pages/QuizDetail'
import { Suspense } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
   return (
      <QueryClientProvider client={queryClient}>
         <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
               <header className="bg-white shadow sticky top-0 z-10">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                     <NavLink to="/quizzes" className="text-xl font-bold text-gray-900">
                        Quiz Builder
                     </NavLink>

                     <div className="flex space-x-4 items-center transition-colors font-semibold">
                        <NavLink
                           to="/quizzes"
                           className={({ isActive }) => (isActive ? 'text-blue-600' : 'text-gray-700 hover:text-black')}
                        >
                           Quizzes
                        </NavLink>
                        <NavLink
                           to="/create"
                           className={({ isActive }) => (isActive ? 'text-blue-600' : 'text-gray-700 hover:text-black')}
                        >
                           Create Quiz
                        </NavLink>
                     </div>
                  </div>
               </header>

               <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
                  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                     <Routes>
                        <Route path="/" element={<QuizList />} />
                        <Route path="/quizzes" element={<QuizList />} />
                        <Route path="/create" element={<QuizCreate />} />
                        <Route path="/quizzes/:id" element={<QuizDetail />} />
                     </Routes>
                  </main>
               </Suspense>
            </div>
         </BrowserRouter>
      </QueryClientProvider>
   )
}

export default App
