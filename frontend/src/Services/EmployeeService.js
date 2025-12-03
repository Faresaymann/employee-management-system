import axios from "axios";

// Base URL for all employee APIs
const EMPLOYEE_API_BASE_URL = "http://localhost:8080/api/v1/employees";

// Get all employees
export const listEmployees = () => axios.get(`${EMPLOYEE_API_BASE_URL}/employees`);

// Add a new employee
export const createEmployee = (employee) => axios.post(`${EMPLOYEE_API_BASE_URL}/add`, employee);

// Get employee by ID
export const getEmployeeById = (id) =>
  axios.get(`${EMPLOYEE_API_BASE_URL}/${id}`);

// Update an employee
export const updateEmployee = (id, employee) =>
  axios.put(`${EMPLOYEE_API_BASE_URL}/update/${id}`, employee);

// Delete an employee
export const deleteEmployee = (id) =>
  axios.delete(`${EMPLOYEE_API_BASE_URL}/delete/${id}`);
