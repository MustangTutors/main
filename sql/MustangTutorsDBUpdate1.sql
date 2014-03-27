#Adds changes to database structure based on original sql file
USE MustangTutors;

ALTER TABLE schedule MODIFY COLUMN start_time TIME;

ALTER TABLE schedule MODIFY COLUMN end_time TIME;

ALTER TABLE records MODIFY COLUMN Date DATE;

ALTER TABLE records ADD COLUMN start_time TIME;

ALTER TABLE records ADD COLUMN end_time TIME;

ALTER TABLE records DROP COLUMN course_name;

ALTER TABLE records ADD COLUMN course_id INT(20);

ALTER TABLE records ADD FOREIGN KEY (course_id) REFERENCES courses(course_id);

ALTER TABLE records ADD FOREIGN KEY (tutor_user_id) REFERENCES users(user_id);

ALTER TABLE comments ADD FOREIGN KEY (tutor_id) REFERENCES users(user_id);

ALTER TABLE rating ADD FOREIGN KEY (tutor_id) REFERENCES users(user_id);
