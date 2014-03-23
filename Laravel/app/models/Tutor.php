<?php
/*
    This is the tutor class that handles the queries that involve tutors
    Date: 3/23/2014
    Functions
    
    getInfoForTutorsPage(curr_user_id,tutor_id)
    addCommentForTutor(user_id,tutor_id,comment)    
    

*/
class Tutor extends Eloquent{

    //get tutors comments by tutor's user_id
    //return an array of the results
    public static function getTutorsComments($user_id)
    {
        $result = DB::select("select users.user_id as Tutor_id,comments.comment,comments.timeStamp from users INNER JOIN comments ON comments.tutor_id = users.user_id WHERE users.user_id = ?",array($user_id));
        return $result;

    }
    
    //get tutor's general info (id,first name,last name, email,average rating)    
    //return an array of the results
    public static function getTutorsGeneralInfo($user_id)
    {
        $result = DB::select("select users.user_id as tutor_id, users.fName as tutor_fName,users.lName as tutor_lName,users.email,AVG(rating.rating) as average_rating from users INNER JOIN rating ON users.user_id = rating.tutor_id where users.user_id = ?",array($user_id));
        return $result;

    }
    //get current user's rating of the tutor by the tutor's id and the user's id
    //return an array of the results
    public static function getUsersCurrentRatingOfTutor($user_id,$tutor_id)
    {
        $result = DB::select("select rating.rating as current_user_rating from rating where rating.user_id = ? and rating.tutor_id = ?;",array($user_id,$tutor_id));
        return $result;
    }

    public function getInfoForTutorsPage($curr_user_id,$tutor_id)
    {
            $result1 = Tutor::getTutorsComments($tutor_id);
            $result2 = Tutor::getTutorsGeneralInfo($tutor_id);
            $result3 = Tutor::getUsersCurrentRatingOfTutor($curr_user_id,$tutor_id);
            $result = array_merge($result1,$result2,$result3);
            echo json_encode($result);
    }
    //this inserts a new comment into the comments table
    public function addCommentForTutor($user_id,$tutor_id,$comment)
    {
        $date = date('Y-m-d h:m:s',time());
        $result = DB::insert("insert into comments (comments.user_id,comments.tutor_id,comments.comment,comments.timeStamp) VALUES (?,?,?,?)",array($user_id,$tutor_id,$comment,$date));
    }









}
?>