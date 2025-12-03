package com.example.backend.Services;

import com.example.backend.Dto.EmployeeDto;

import java.util.List;

public interface EmployeeService {
    EmployeeDto createEmployee(EmployeeDto employeeDto);

    EmployeeDto getEmployeeById(Long id);
    EmployeeDto updateEmployee(Long id , EmployeeDto employeeDto);
    List<EmployeeDto> getAllEmployees();
    void deleteEmployee(Long id);

}
