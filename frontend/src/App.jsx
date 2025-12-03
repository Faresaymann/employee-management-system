import './App.css'
import ListEmployeeComponent from './Components/ListEmployeeComponent'
import EmployeeComponent from './Components/EmployeeComponent'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* // http://localhost:3000/ */}
        <Route path='/' element={<ListEmployeeComponent />} />
         {/* // http://localhost:3000/employees */}
        <Route path='/employees' element={<ListEmployeeComponent />} />
         {/* // http://localhost:3000/add-employee */}
        <Route path='/add-employee' element={<EmployeeComponent />} />  
          {/* // http://localhost:3000/edit-employee */}
        <Route path='/edit-employee/:id'  element={<EmployeeComponent />} />
          {/* // http://localhost:3000/delete-employee */} 
        <Route path='/delete-employee' element={<EmployeeComponent />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
