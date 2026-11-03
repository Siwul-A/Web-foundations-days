# School Database Design

## Table Explanations
1. **students**: Stores personal information for each student (`id`, `name`, `email`, `created_at`). The `email` column has a `UNIQUE` constraint to ensure no two students share the same email.
2. **courses**: Stores information regarding available school courses (`id`, `title`, `instructor`).
3. **enrolments**: Acts as a join table linking `students` and `courses`. It contains foreign keys and stores the student's `grade`. 

## Relationships
- **students and courses (Many-to-Many)**: A student can enrol in multiple courses, and a course can have multiple students. 
- **Join Table (enrolments)**: Since relational databases cannot directly represent many-to-many relationships, the `enrolments` table is used. It breaks down the many-to-many relationship into two one-to-many relationships using a composite primary key (`student_id`, `course_id`) which also prevents a student from enrolling in the exact same course twice.

## Indexing
- **Index to add**: `CREATE INDEX idx_enrolments_student_id ON enrolments(student_id);`
- **Reason**: Since we will frequently query to find which courses a student is taking or to calculate grades per student, indexing the `student_id` in the `enrolments` table will speed up search operations during `JOIN` queries.

## SQL vs NoSQL Choice
For this school database system, **SQL (Relational Database)** is the ideal choice. A school system relies heavily on strict data integrity, structured schemas (students, courses, grades), and explicit many-to-many relationships enforced by foreign keys and constraints. SQL guarantees ACID compliance, which is crucial for academic records where accuracy and consistency are paramount.