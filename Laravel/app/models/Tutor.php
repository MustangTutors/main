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

    public function searchTutors()
    {
        //Prepare generic query
        $query = "SELECT u.fName, u.lName, c.subject, c.course_number, c.course_name, u.available FROM users u inner join courses_tutored ct on u.user_id = ct.user_id inner join courses c on ct.course_id = c. course_id WHERE ";

        //Append WHERE clause based on parameters
        $params=array();    
    
        //First check if no parameters are set 
        if(!(Input::has('fname') || Input::has('lname') || Input::has('subject') || Input::has('cnumber') || Input::has('cname') || Input::has('available'))){
            $query.= "1";
        }
        //Add parameters to the WHERE clause and the parameter array
        else
        {         
            if(Input::has('fname')){
                $query.="u.fName = ? AND ";
                $params[]=Input::get('fname');
            }
            if(Input::has('lname')){
                $query.="u.lName = ? AND ";
                $params[] = Input::get('lname');
            }
            if(Input::has('subject')){
                $query.="c.subject = ? AND ";
                $params[] = Input::get('subject');
            }
            if(Input::has('cnumber')){
                $query.="c.course_number = ? AND ";
                $params[] = Input::get('cnumber');
            }
            if(Input::has('cname')){
                $query.="c.course_name = ? AND ";
                $params[]=Input::get('cname');
            }
            if(Input::has('available')){
                $query.="u.available = ? AND ";
                $params[]=Input::get('available');
            }    
        //Remove the trailing "AND "
        $query= substr_replace($query,"",-4);      
        }    
        
        //Submit query    
        $result=DB::select($query,$params);
        echo json_encode($result);
      }
    
    
    
        



}
?>
