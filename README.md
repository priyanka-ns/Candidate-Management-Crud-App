# Candidate Management CRUD App

A web-based **Spring Boot** application to manage candidate records with full **CRUD** (Create, Read, Update, Delete) operations, server-side **pagination** and **sorting**. Built as a hands-on project to practise Spring Boot, Spring Data JPA and server-rendered views with Thymeleaf.

## Features
- Add, view, edit and delete candidate records.
- List view with **pagination** (5 records per page) and **sorting** by any column (ascending/descending).
- Candidate profile fields split across two tables using JPA `@SecondaryTable` (core details + extended details).
- Flash messages for user feedback after each action.

## Tech Stack
- **Language:** Java 8
- **Framework:** Spring Boot 2.5.x (Spring MVC, Spring Data JPA)
- **View:** Thymeleaf
- **Database:** MySQL 8 (Hibernate ORM)
- **Build:** Maven
- **Packaging:** WAR (runnable on embedded or external Tomcat)

## Data Model
`Candidate` — first name, last name, email, phone number, and (in a secondary `details` table) location, education, experience, source and status.

## Configuration
Database credentials are read from environment variables (no secrets in the repo):

| Variable | Description | Default |
|---|---|---|
| `DB_USERNAME` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | *(required)* |

See [`.env.example`](.env.example) for the template. The app connects to `jdbc:mysql://localhost:3306/candidate_db` and creates/updates the schema automatically (`ddl-auto=update`).

## Getting Started

**Prerequisites:** JDK 8+, Maven, MySQL 8.

1. Create the database:
   ```sql
   CREATE DATABASE candidate_db;
   ```
2. Set your credentials (example):
   ```bash
   export DB_USERNAME=root
   export DB_PASSWORD=your_local_mysql_password
   ```
3. Run the app:
   ```bash
   ./mvnw spring-boot:run
   ```
4. Open http://localhost:8081/

## Endpoints
| Method | Path | Purpose |
|---|---|---|
| GET | `/` | List candidates (first page) |
| GET | `/page/{pageNo}?sortField=&sortDir=` | Paginated + sorted list |
| GET | `/load_form` | Add-candidate form |
| POST | `/save_candidate` | Save a new candidate |
| GET | `/edit_form/{id}` | Edit-candidate form |
| POST | `/update_candidate` | Update a candidate |
| GET | `/delete/{id}` | Delete a candidate |

## Author
Priyanka Singh
