<?php
/*
    This is the tutor class that handles the queries that involve tutors
    Date: 3/23/2014
    Functions
    
    getInfoForTutorsPage(curr_user_id,tutor_id)
    addCommentForTutor(user_id,tutor_id,comment)    
    

*/
class Tutor extends Eloquent{

    //this returns an array of all the courses a tutor tutors
    public static function getTutorsCourses($tutor_id){
        $result = DB::select('select subject,course_number,course_name from courses INNER JOIN courses_tutored ON courses_tutored.course_id = courses.course_id where courses_tutored.user_id = ?', array($tutor_id));
        return $result;
    }
    //this returns an array of all the hours a tutor tutors
    public static function getTutorsHours($tutor_id){
        $result = DB::select('select day,start_time,end_time from schedule where user_id = ?', array($tutor_id));
        return $result;
    }
    //get tutors comments by tutor's user_id
    //return an array of the results
    public static function getTutorsComments($tutor_id)
    {
        $result = DB::select("select * from comments where tutor_id = ?",array($tutor_id));
        return $result;

    }
    
    //get tutor's general info (id,first name,last name, available,#ratings,average rating)    
    //return an array of the results
    public static function getTutorsGeneralInfo($user_id)
    {
        $result = DB::select("select users.user_id as tutor_id, users.fName as tutor_fName,users.lName as tutor_lName,users.available,COUNT(rating.rating) as numberOfRatings,AVG(rating.rating) as average_rating from users INNER JOIN rating ON users.user_id = rating.tutor_id where users.user_id = ?",array($user_id));
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
            $result2 = Tutor::getTutorsGeneralInfo($tutor_id);
            $result3 = Tutor::getUsersCurrentRatingOfTutor($curr_user_id,$tutor_id);
            $result4 = Tutor::getTutorsCourses($tutor_id);
            $result5 = Tutor::getTutorsHours($tutor_id);
            $result6 = Tutor::getTutorsComments($tutor_id);
            $result0 = array();      
            foreach($result2[0] as $key=>$value){
                $result0[$key]=$value;
            }
            if(isset($result3[0]->current_user_rating))
            {
                $result0['current_user_rating'] = $result3[0]->current_user_rating;
            }else
            {
                $result0['current_user_rating'] = null;
            }
            $iter = 0;
            foreach($result4 as $value)
            {
                $result0['courses'][$iter] = $value;
                $iter = $iter+1;
            }
            $iter = 0;
            foreach($result5 as $value)
            {
                $result0['hours'][$iter] = $value;
                $iter = $iter+1;
            }
            $iter = 0;
            foreach($result6 as $value)
            {
                $result0['comments'][$iter] = $value;
                $commenters_rating = Tutor::getUsersCurrentRatingOfTutor($value->user_id,$tutor_id);
                if(isset($commenters_rating[0]->current_user_rating))
                {
                    $result0['comments'][$iter]->rating_from_commenter = $commenters_rating[0]->current_user_rating;
                }else{
                    $result0['comments'][$iter]->rating_from_commenter = null;
                }
                $iter = $iter +1;
            }
            echo json_encode($result0);
    }
    
    //this inserts a new comment into the comments table
    public function addCommentForTutor($user_id,$tutor_id,$comment)
    {
        $date = date('Y-m-d h:m:s',time());
        $result = DB::insert("insert into comments (comments.user_id,comments.tutor_id,comments.comment,comments.timeStamp) VALUES (?,?,?,?)",array($user_id,$tutor_id,$comment,$date));
    }

    //Create/Update a rating
    public function rateTutor()
    {       

        //Initialize variables
        if(isset($_SESSION['user_id'])){$userid= $_SESSION['user_id'];} else{$userid = Input::get('userid',0);}
        if(isset($_SESSION['tutor_id'])){$userid= $_SESSION['tutor_id'];} else{$tutorid = Input::get('tutorid',0);}
        if(isset($_SESSION['rating'])){$userid= $_SESSION['rating'];} else{$rating = Input::get('rating',0);}

        //Check if user has already rated the tutor
        $query= "SELECT * FROM rating WHERE user_id = ? AND tutor_id = ?";
        $result = DB::select($query,array($userid,$tutorid));

        if(!empty($result)){
            $query = "UPDATE rating SET rating=? WHERE user_id=? AND tutor_id=?";
            $result = DB::update($query,array($rating,$userid,$tutorid));
            echo $result;
        }   
        else
        {
            $query = "INSERT INTO rating(user_id,tutor_id,rating) VALUES (?,?,?)";
            $result = DB::insert($query,array($userid,$tutorid,$rating));
            echo $result;
        }

    }


    //Tutor search function
    public function searchTutors()
    {
        //Prepare generic query
        $query = "SELECT u.User_ID, u.fName as First_Name, u.lName as Last_Name, u.Available, u.Active, COUNT(distinct r.rating_id) as Number_Ratings, AVG(distinct r.rating) as Average_Rating FROM users u inner join courses_tutored ct on u.user_id = ct.user_id inner join courses c on ct.course_id = c.course_id left outer join rating r on r.tutor_id = u.user_id WHERE u.tutor = 1 AND ";
        
        if (!Input::has('admin')) {
            $query.="u.active = 1 AND ";
        }
        
        //Append WHERE clause based on parameters
        $params=array();    
    
        //First check if no parameters are set 
        if(!(Input::has('fname') || Input::has('lname') || Input::has('subject') || Input::has('cnumber') || Input::has('cname') || Input::has('available'))){
            $query= substr_replace($query,"",-4);            
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
        //Remove duplicates and/or allow COUNT and AVG to work
        $query.=" GROUP BY u.user_id ORDER BY u.available DESC";
        //Submit query          
        $result=DB::select($query,$params);
        echo json_encode($result);
      }
    
    
    
        



}
?>
