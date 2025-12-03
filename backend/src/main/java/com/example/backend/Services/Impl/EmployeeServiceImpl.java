package com.example.backend.Services.Impl;

import com.example.backend.Dto.EmployeeDto;
import com.example.backend.Entities.Employee;
import com.example.backend.Exceptions.ResourceNotFoundException;
import com.example.backend.Mapper.EmployeeMapper;
import com.example.backend.Repositories.EmployeeeRepo;
import com.example.backend.Services.EmployeeService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class EmployeeServiceImpl  implements EmployeeService{

    private final EmployeeeRepo employeeeRepo;

    @Override
    public EmployeeDto createEmployee(EmployeeDto employeeDto) {

        Employee employee = EmployeeMapper.mapToEmployee(employeeDto);
        Employee savedEmployee= employeeeRepo.save(employee);
        return EmployeeMapper.mapToEmployeeDto(savedEmployee);
    }

    @Override
    public EmployeeDto getEmployeeById(Long id) {
        Employee employee= employeeeRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Employee not found with id : "+ id));
        return EmployeeMapper.mapToEmployeeDto(employee);
    }

    @Override
    public List<EmployeeDto> getAllEmployees() {
        List<Employee> employees = employeeeRepo.findAll();
        return employees.stream()
                .map(EmployeeMapper::mapToEmployeeDto)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeDto updateEmployee(Long id,EmployeeDto employeeDto) {

        Employee employee= employeeeRepo.findById(id).orElseThrow(()
                -> new ResourceNotFoundException("Employee not found with  id : "+ id));
        employee.setFirstname(employeeDto.getFirstname());
        employee.setLastname(employeeDto.getLastname());
        employee.setEmail(employeeDto.getEmail());

        Employee updatedEmployee = employeeeRepo.save(employee);
        return EmployeeMapper.mapToEmployeeDto(updatedEmployee);
    }
    @Override
    public void deleteEmployee(Long id) {
        Employee employee = employeeeRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        employeeeRepo.delete(employee);
    }



}
