import axios from "axios"

const EMPLOYEE_API_BASE_URL = "http://localhost:8080/api/v1/employees/employees"


export const listEmployees = () => axios.get(EMPLOYEE_API_BASE_URL);

