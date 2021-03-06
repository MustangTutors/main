<?php
/*
    This is the Admin class that handles the queries that involve administrators
    Date: 4/2/2014
    Functions
    
    getApplications()
        
    

*/
class Admin extends Eloquent{

    //echos a json holding the pending applications info
    public function getApplications(){
        $result = DB::select("SELECT users.user_id,users.fName as First_Name,users.lName as Last_Name from applications INNER JOIN
users ON applications.user_id = users.user_id
WHERE applications.pending = 1",array());
        $result = array('Applications' => $result);
        foreach ($result['Applications'] as $user)
        {
            
            $curr_user_id = $user->user_id;
            $result_temp1 = Admin::getApplicantsCourses($curr_user_id);
            $result_temp2 = Admin::getApplicantsHours($curr_user_id);
            $user->Courses = $result_temp1;
            $user->Hours = $result_temp2;
        }
        echo json_encode($result);
    }
    
    //gets all of an applicants courses, returns in an array
    public static function getApplicantsCourses($user_id){
        $result = DB::select('select subject,course_number,course_name from courses INNER JOIN courses_tutored ON courses_tutored.course_id = courses.course_id where courses_tutored.user_id = ?', array($user_id));
        return $result;
    }
    
    //getsa ll of the applicants schedule, returns in an array
    public static function getApplicantsHours($user_id){
        $result = DB::select('select day,start_time,end_time from schedule where user_id = ?', array($user_id));
        return $result;
    }
    
    //updates a tutor status to 1 since they are approved, change their pending application to 0 (not pending)
    public function approveTutor($tutor_id)
    {
        $result = DB::update("UPDATE users set users.tutor = 1 WHERE user_id = ?",array($tutor_id));
        $result = DB::update("UPDATE applications set applications.pending = 0 where user_id = ?",array($tutor_id));
        $result = DB::update("UPDATE users set users.active = 1 WHERE user_id = ?",array($tutor_id));
    }
    
    //deletes an applicants application from the table
    public function denyTutor($tutor_id)
    {
        $result = DB::delete("DELETE from courses_tutored where user_id = ?",array($tutor_id));
        $result = DB::delete("DELETE from schedule where user_id = ?",array($tutor_id));
        $result = DB::update("UPDATE applications set applications.pending = 0 WHERE user_id = ?",array($tutor_id));

    }










}