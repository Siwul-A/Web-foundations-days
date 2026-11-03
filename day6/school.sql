CREATE TABLE students (
  id          INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  created_at  TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
  id          INTEGER PRIMARY KEY,
  title       TEXT NOT NULL,
  instructor  TEXT NOT NULL
);

CREATE TABLE enrolments (
  student_id  INTEGER NOT NULL,
  course_id   INTEGER NOT NULL,
  grade       TEXT NOT NULL DEFAULT 'Pending',
  PRIMARY KEY (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id)  REFERENCES courses(id)  ON DELETE CASCADE
);

INSERT INTO students (name, email) VALUES ('Abebe Kebede', 'abebe@example.com');
INSERT INTO students (name, email) VALUES ('Tigist Mamo', 'tigist@example.com');
INSERT INTO students (name, email) VALUES ('Dawit Bekele', 'dawit@example.com');
INSERT INTO students (name, email) VALUES ('Sara Hussen', 'sara@example.com');

INSERT INTO courses (title, instructor) VALUES ('Web Development', 'Dr. John');
INSERT INTO courses (title, instructor) VALUES ('Database Systems', 'Dr. Smith');
INSERT INTO courses (title, instructor) VALUES ('Data Analysis', 'Dr. Alan');

INSERT INTO enrolments (student_id, course_id, grade) VALUES (1, 1, 'A');
INSERT INTO enrolments (student_id, course_id, grade) VALUES (1, 2, 'B');
INSERT INTO enrolments (student_id, course_id, grade) VALUES (2, 1, 'A');
INSERT INTO enrolments (student_id, course_id, grade) VALUES (2, 3, 'C');
INSERT INTO enrolments (student_id, course_id, grade) VALUES (3, 2, 'B');

SELECT courses.title, courses.instructor, enrolments.grade
FROM enrolments
JOIN courses ON courses.id = enrolments.course_id
JOIN students ON students.id = enrolments.student_id
WHERE students.name = 'Abebe Kebede';

SELECT students.name, students.email, enrolments.grade
FROM enrolments
JOIN students ON students.id = enrolments.student_id
JOIN courses ON courses.id = enrolments.course_id
WHERE courses.title = 'Web Development';

SELECT courses.title, COUNT(enrolments.student_id) AS student_count
FROM courses
LEFT JOIN enrolments ON enrolments.course_id = courses.id
GROUP BY courses.id;

SELECT students.name, students.email
FROM students
LEFT JOIN enrolments ON enrolments.student_id = students.id
WHERE enrolments.course_id IS NULL;

UPDATE enrolments 
SET grade = 'A+' 
WHERE student_id = 1 AND course_id = 2;