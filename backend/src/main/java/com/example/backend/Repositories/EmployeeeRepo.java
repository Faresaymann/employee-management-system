package com.example.backend.Repositories;

import com.example.backend.Entities.Employee;
import org.springframework.data.jpa.repository.JpaRepository;


public interface EmployeeeRepo extends JpaRepository<Employee, Long> {
}
