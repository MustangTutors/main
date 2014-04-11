<?php
/*
    This is the courses class that handles the queries that involve tutors
    Date: 3/25/2014
    Functions
    
    getUniqueSubjects()
    

*/
class Course extends Eloquent{

    public function getUniqueSubjects()
    {
        $result = DB::select("select DISTINCT courses.subject from courses order by courses.subject");
        echo json_encode($result);
    }

    //this takes the course data json and updates the courses a tutor tutors in the courses_tutored table 
    public function updateCourses()
    {
        
        //FOR TESTING USE THE COMMENTED OUT DATA
        /*
        $temp_course_data = 
        array(
            array("Course_ID"=>3),
            array("Course_ID"=>1),
            array("Course_ID"=>2)
            );
        $temp_data = array("User_ID" =>1,"Courses"=>$temp_course_data);
        $_POST['new_courses'] = json_encode($temp_data);
        */
                
        $new_data = json_decode($_POST['new_courses']);
        $user_id = $new_data->User_ID;
        
        //delete all courses taught by that tutor
        $result = DB::delete("DELETE FROM courses_tutored WHERE user_id = ?",array($user_id));
        
        //insert new courses into courses tutored table
        foreach ($new_data->Courses as $course)
        {
            $course_id = $course->Course_ID;
            $result = DB::insert("INSERT INTO courses_tutored (course_id,user_id) VALUES (?,?)",array($course_id,$user_id));
        } 
    }

    public function showCourses()
    {
        $result = DB::select("Select * from courses order by subject, course_number");
        echo json_encode($result);
    }


}

?>