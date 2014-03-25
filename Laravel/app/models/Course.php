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
        $result = DB::select("select DISTINCT courses.subject from courses");
        echo json_encode($result);
    }




}

?>