-- Courses are a "Course" or "Exam prep"; levels move to Elementary School / Middle School /
-- High School / College / Professional.
ALTER TABLE courses ADD COLUMN kind TEXT NOT NULL DEFAULT 'Course';
UPDATE courses SET level = 'Professional' WHERE level = 'Adult';
UPDATE courses SET level = 'Elementary School' WHERE level = 'Elementary';
UPDATE courses SET level = 'Middle School' WHERE level = 'Middle school';
UPDATE courses SET level = 'High School' WHERE level = 'High school';
