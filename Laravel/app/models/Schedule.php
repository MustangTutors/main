<?php
/*
    This is the schedule class that handles the queries that involve schedule
    Date: 3/25/2014
    Functions
    
    updateHours()
    

*/
class Schedule extends Eloquent{
    //this takes the hours data json and updates the hours a tutor tutors in the schedule table 
    public function updateHours()
    {
        
        //FOR TESTING USE THE COMMENTED OUT DATA
        /*
        $temp_hours_data =                           
        array(
            array(
                "Day"=>1,
                "Start_Time"=>"11:00",
                "End_Time"=>"16:00"),
            array(
                "Day"=>2,
                "Start_Time"=>"10:00",
                "End_Time"=>"12:00"),
            array(
                "Day"=>7,
                "Start_Time"=>"11:00",
                "End_Time"=>"16:00")
            );
        $temp_data = array("User_ID" =>2,"Hours"=>$temp_hours_data);
        $_POST['new_hours'] = json_encode($temp_data);
        */
                
        $new_data = json_decode($_POST['new_hours']);
        $user_id = $new_data->User_ID;
        
        //delete all hours taught by that tutor
        $result = DB::delete("DELETE FROM schedule WHERE user_id = ?",array($user_id));
        
        //insert new hours into schedule table
        foreach ($new_data->Hours as $hour)
        {
            $day = $hour->Day;
            $start_time = $hour->Start_Time;
            $end_time = $hour->End_Time;
            
            $result = DB::insert("INSERT INTO schedule (day,user_id,start_time,end_time) VALUES (?,?,?,?)",array($day,$user_id,$start_time,$end_time));
        }
    }
    
    
}