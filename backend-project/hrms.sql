-- HRMS MySQL dump for XAMPP
-- Run in phpMyAdmin or mysql CLI: source hrms.sql

DROP DATABASE IF EXISTS HRMS;
CREATE DATABASE HRMS CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE HRMS;

-- Departments
CREATE TABLE Department (
  id INT AUTO_INCREMENT PRIMARY KEY,
  DepartName VARCHAR(100) NOT NULL
);

-- Positions
CREATE TABLE Position (
  id INT AUTO_INCREMENT PRIMARY KEY,
  PosName VARCHAR(100) NOT NULL,
  RequiredQualification VARCHAR(255)
);

-- Employees
CREATE TABLE Employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  EmpFirstName VARCHAR(100) NOT NULL,
  EmpLastName VARCHAR(100) NOT NULL,
  EmpGender ENUM('Male','Female','Other') DEFAULT 'Other',
  EmpDateOfBirth DATE,
  EmpEmail VARCHAR(150),
  EmpTelephone VARCHAR(50),
  EmpAddress VARCHAR(255),
  EmpHireDate DATE,
  EmpStatus ENUM('on leave','left','blacklisted','deceased','on mission') DEFAULT 'on mission',
  DepartmentId INT,
  PositionId INT,
  FOREIGN KEY (DepartmentId) REFERENCES Department(id) ON DELETE SET NULL,
  FOREIGN KEY (PositionId) REFERENCES `Position`(id) ON DELETE SET NULL
);

-- Users (a user is also an employee)
CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  UserName VARCHAR(100) NOT NULL UNIQUE,
  Password VARCHAR(255) NOT NULL,
  EmployeeId INT,
  FOREIGN KEY (EmployeeId) REFERENCES Employee(id) ON DELETE SET NULL
);

-- Sample data
INSERT INTO Department (DepartName) VALUES ('Accounts'),('Sales'),('HR'),('Logistics');
INSERT INTO Position (PosName, RequiredQualification) VALUES
('Manager','Bachelor Degree'),
('Accountant','Diploma'),
('Sales Person','High School'),
('Clerk','Certificate');

-- sample employees
INSERT INTO Employee (EmpFirstName, EmpLastName, EmpGender, EmpDateOfBirth, EmpEmail, EmpTelephone, EmpAddress, EmpHireDate, EmpStatus, DepartmentId, PositionId)
VALUES
('Alice','Kamanzi','Female','1990-05-12','alice@example.com','0780000001','Kigali','2020-01-15','on leave',3,1),
('Bob','Uwase','Male','1985-11-03','bob@example.com','0780000002','Kigali','2018-06-10','on mission',2,3),
('Charles','Ndahiro','Male','1978-02-20','charles@example.com','0780000003','Kigali','2010-09-01','left',1,2);

-- sample user linked to Alice (password: password123) — store plain for exam/demo
INSERT INTO Users (UserName, Password, EmployeeId) VALUES ('admin','password123',1);

-- View: employees on leave by department
-- Use this query to generate the Employee Status Report (employees on leave grouped by department)
CREATE VIEW Employees_On_Leave AS
SELECT d.DepartName, e.id AS EmployeeId, e.EmpFirstName, e.EmpLastName, e.EmpEmail, e.EmpTelephone, e.EmpStatus
FROM Employee e
LEFT JOIN Department d ON e.DepartmentId = d.id
WHERE e.EmpStatus = 'on leave'
ORDER BY d.DepartName, e.EmpLastName;

-- Total count of employees on leave
CREATE VIEW Employees_On_Leave_Count AS
SELECT d.DepartName, COUNT(e.id) AS TotalOnLeave
FROM Employee e
LEFT JOIN Department d ON e.DepartmentId = d.id
WHERE e.EmpStatus = 'on leave'
GROUP BY d.DepartName;
