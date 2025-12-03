package com.example.backend.Controllers;

import com.example.backend.Dto.EmployeeDto;
import com.example.backend.Repositories.EmployeeeRepo;
import com.example.backend.Services.EmployeeService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/employees")
public class EmployeeController {
    private EmployeeService employeeService;


    //Build Add Employee REST API
    @PostMapping(value = "/add")
    public ResponseEntity<EmployeeDto> createEmployee(@RequestBody EmployeeDto employeeDto){
       EmployeeDto savedemployee = employeeService.createEmployee(employeeDto);
        //return ResponseEntity.ok(employeeService.createEmployee(employeeDto));
        return new ResponseEntity<>(savedemployee, HttpStatus.CREATED);
    }

    //Build Get Employee REST API
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable Long id){
       EmployeeDto employeeDto= employeeService.getEmployeeById(id);
       return ResponseEntity.ok(employeeDto);
    }

    //Build Get All Employee REST API
    @GetMapping("/employees")
    public ResponseEntity<List<EmployeeDto>> getAllEmployees(){
        List<EmployeeDto> employees= employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    //Build Update Employee REST API
    @PutMapping("/update/{id}")
    public ResponseEntity<EmployeeDto> updateEmployee( @PathVariable Long id ,@RequestBody EmployeeDto employeeDto){
        EmployeeDto updateEmployee= employeeService.updateEmployee(id,employeeDto);
        return ResponseEntity.ok(updateEmployee);
    }

    //Build Delete Employee REST API
    @DeleteMapping("/delete/{id}")
    public  ResponseEntity<Void> deleteEmployee(@PathVariable Long id){
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }



}
