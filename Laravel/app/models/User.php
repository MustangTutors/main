<?php

use Illuminate\Auth\UserInterface;
use Illuminate\Auth\Reminders\RemindableInterface;

class User extends Eloquent implements UserInterface, RemindableInterface {

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'users';
    protected $user_id;
	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = array('password');

    public function getCurrUserInfo($user_id=-1){
         
         $id=Input::get('user_id',$user_id);
         
         if($user_id==-1 && isset($_SESSION['user_id'])){
            $id=$_SESSION['user_id'];
         }

         $result = DB::select("select * from users where user_id = ?",array($id));
         echo json_encode($result);    
    }
    
     //logs in a user if their id and password match
     //also sets availability to 2 if user is a tutor
     //echos a json of user data
     public function loginUser($smu_id,$password)
     {
         //first check if user valid
         $result = DB::select("select * from users where smu_id = ? AND pswd = ?",array($smu_id,$password));
         if (isset($result[0]))
         {
             //set the session variable 
             $_SESSION['user_id'] = $result[0]->user_id;
             if($result[0]->tutor == 1)
             {
                 //change availability of tutor to 2 (available)
                 DB::update("update users SET available = 2 WHERE user_id = ?",array($result[0]->user_id));
             }
            echo json_encode($result);
         }else
         {
             echo ("The user was not logged in properly");
        }
    }
    
    //logout a user by setting availability to 0 and clearing session variables
    public function logoutUser($id)
    {        
        //for the web version
        if($id == '-1'){
            if(isset($_SESSION['user_id'])){
                DB::update("update users SET available = 0 WHERE user_id = ?",array($_SESSION['user_id']));
                session_destroy();
                echo ("you are successfully logged out");
            }else{
                echo ("no user is logged in");
            }
        //for the android version
        }else{
            DB::update("update users SET available = 0 WHERE user_id = ?",array($id));
            echo ("you are successfully logged out");
        }
    }
    
    //toggle availability for a tutor
    public function toggleAvailable($id)
    {
        $result = DB::select("select * from users where user_id = ?",array($id));
        if($result[0]->available != 2)
            DB::update("update users SET available = 2 WHERE user_id = ?",array($id));
        else
            DB::update("update users SET available = 1 WHERE user_id = ?",array($id));
 
     }
	/**
	 * Get the unique identifier for the user.
	 *
	 * @return mixed
	 */
	public function getAuthIdentifier()
	{
		return $this->getKey();
	}

	/**
	 * Get the password for the user.
	 *
	 * @return string
	 */
	public function getAuthPassword()
	{
		return $this->password;
	}

	/**
	 * Get the e-mail address where password reminders are sent.
	 *
	 * @return string
	 */
	public function getReminderEmail()
	{
		return $this->email;
	}
	
    /**
    * get a user's ID if the user_id and codeword are correct
    *
    *  @return true if codeword correct and false if incorrect
    */
    public function checkCodeWord($smu_id,$codeword)
    {
        $result=DB::select("select user_id from users where smu_id = ? AND codeword = ?",array($smu_id,$codeword));
        return $result;
    }
    
    /**
    * get a user's records based on their user_id
    *
    * @echo these users in a JSON
    */
    public function getUsersRecords($user_id)
    {
        $result= DB::select("SELECT c.subject, c.course_number, c.course_name, tu.fName, tu.lName, r.date AS day, r.start_time, r.end_time, r.summary FROM records r INNER JOIN users u ON r.user_id = u.user_id INNER JOIN users tu ON r.tutor_user_id = tu.user_id INNER JOIN courses c on r.course_id = c.course_id  WHERE u.user_id = ? ORDER BY r.date DESC, r.start_time DESC",array($user_id));

        $endJson=array();
        $endJson['user_id']=$user_id;
        if(!empty($result))
        {         
            $endJson['meetings']=$result;
        }
        echo json_encode($endJson);
    }

    /**
      * get a user's records based on their smu_id
      *
      * @echo these users in a JSON
      */
      public function getUsersRecordsParent($smu_id)
      {
        $result=DB::select("SELECT user_id FROM users WHERE smu_id=?",array($smu_id));
        if(isset($result[0]))$user_id=$result[0]->user_id;
        $result= DB::select("SELECT c.subject, c.course_number, c.course_name, tu.fName, tu.lName, r.date AS day, r.start_time, r.end_time, r.summary FROM records r INNER JOIN users u ON r.user_id = u.user_id INNER JOIN users tu ON r.tutor_user_id = tu.user_id INNER JOIN courses c on r.course_id = c.course_id  WHERE u.smu_id = ? ORDER BY r.date DESC, r.start_time DESC",array($smu_id));

        $endJson=array();
        $endJson['user_id']=$user_id;
        if(!empty($result))
        {         
            $endJson['meetings']=$result;
        }
        echo json_encode($endJson);
      }

    /**
    * Retrieve the most recent application status of a user
    * @param $user_id INT ID of the user whose application status is to be checked
    * @return -1 if no application is found for the user, the application's pending field otherwise
    */
    public function checkApplicationStatus($user_id)
    {
        $query="SELECT application_id, pending FROM applications WHERE user_id = ? ORDER BY application_id DESC";
        $result=DB::select($query,array($user_id));
        if(empty($result)) return -1;
        else return $result[0]->pending;
    }

    /**
    * Add application of the user identified by user_id and insert information into schedule and courses tutored tables   
    * @echo application status in JSON format
    */
    public function addApplication()
    {
        
        //this info used to test without postman because screw 32 bit ubuntu, right google?
        //$testjson='{"User_ID": 1,"Courses": [{"Course_ID": 1},{"Course_ID": 2},{"Course_ID": 3}],"Hours": [{"Day": 1,"Start_Time": "11:00","End_Time": "16:00"},{"Day": 3,"Start_Time": "10:00","End_Time": "12:00"},{"Day": 5,"Start_Time": "11:00","End_Time": "16:00"}]}';
        //$json=json_decode($testjson);        
        
        $json=json_decode($_POST['application']);

        //Insert new tuple in applications table
        $user_id=$json->User_ID; 
        $appstatus= self::checkApplicationStatus($user_id);

        if($appstatus!=-1 && $appstatus!=0)
        {
            echo "You have already submitted an application.";
        } 
        
        else
        {        
            $query="INSERT INTO applications(user_id,pending) VALUES (?,1)";
            DB::insert($query,array($user_id));
    
            //Insert rows into schedule table
            foreach($json->Hours as $hours)
            {
                $query="INSERT INTO schedule(user_id,day,start_time,end_time) VALUES (?,?,?,?)";
                DB::insert($query,array($user_id,$hours->Day,$hours->Start_Time,$hours->End_Time));
            }
    
            //Insert rows into courses_tutored table
            foreach($json->Courses as $courses)
            {
                $query="INSERT INTO courses_tutored(course_id,user_id) VALUES (?,?)";
                DB::insert($query,array($courses->Course_ID,$user_id));
            }
    
            //Check success of inserts
            $query="SELECT a.user_id, c.course_name,s.day,s.start_time,s.end_time FROM applications a INNER JOIN courses_tutored ct on a.user_id =  ct.user_id INNER JOIN schedule s ON a.user_id = s.user_id INNER JOIN courses c ON ct.course_id = c.course_id WHERE a.user_id = ? GROUP BY   c.course_name, s.day ORDER BY s.day, s.start_time, c.course_name";
            $result=DB::select($query,array($user_id));
            echo json_encode($result);
        }
    }

    public function addPhoto()
    {
        $user_id = $_SESSION['user_id'];
        if ($user_id != -1)
        {
            if(Input::hasFile('photo'))
            {
                $extension = Input::file('photo')->getClientOriginalExtension();
                if (strtolower($extension) != "jpg")
                {
                    return "invalid";
                }
                $newName=$user_id.".jpg";
                Input::file('photo')->move('../../img/tutors', $newName);
                return $newName;
            }
            else
            {
                return "failed";
            }
        }
        else
        {
            return "failed";
        }
    }

    public function testAddPhoto()
    {
        $user_id = $_SESSION['user_id'];
        echo $user_id . "<br>";
        if ($user_id != -1)
        {
            if(Input::hasFile('photo'))
            {
                $extension = Input::file('photo')->getClientOriginalExtension();
                echo $extension . "<br>";
                if (strtolower($extension) != "jpg")
                {
                    echo "invalid" . "<br>";
                }
                $newName=$user_id.".jpg";
                Input::file('photo')->move('../../img/tutors', $newName);
                echo $newName . "<br>";
            }
            else {
                echo "no photo<br>";
            }
        }
        else
        {
            echo "failed" . "<br>";
        }
    }

    /**
    * send a user's id and codeword to a list of email addresses
    *
    */
    public function sendEmailWithCodeword()
    {        
        $email_json = json_decode($_POST['emails']);
        $emails = $email_json->emails;
        $user_id = $_SESSION['user_id'];
        $result = DB::select("select smu_id,codeword from users where user_id = ?",array($user_id));
        $codeword = $result[0]->codeword;
        $smu_id = $result[0]->smu_id;
        foreach($emails as $email)
        {
            Mail::later(5,'emails.codeword.codeword', array('smu_id'=>$smu_id,'codeword'=>$codeword), function($message) use ($email){
                $message->to($email)->subject('MUSTANG TUTORS CODEWORD');
           });
        }
    }

   /**
   * Update the account information of a given user, or current user if no Id is provided.
   * @param $id INT the id of the user whose info is to be edited
   * @echo JSON containing the updated user tuple.
   */
   public function updateInfo($id = -1){
    if($id == -1)$id = Session::get('user_id', -1);
    $fname = Input::get('fName');
    $lname = Input::get('lname');
    $password = Input::get('password',"");
    $query = "UPDATE users SET fname = ?, lname = ?";
    $params=array($fname,$lname);
    if(!empty($password))
    {
        $query.=", pswd = ?";
        array_push($params,$password);
    }
    $query.=" WHERE user_id = ?";
    array_push($params,$id);
    DB::update($query,$params);
    $result=DB::select("SELECT * FROM users WHERE user_id = ?",array($id));
    echo json_encode($result);
   }
    

   /**
   * Get the availability status of the user of the given ID, or the current user if no ID is provided.
   * @param $id INT the id of the user whose status is to be retrieved
   * @echo JSON containing the availability status
   */
   public function getAvailability($id = -1){
    if($id == -1) $id = Session::get('user_id', -1);
    $result=DB::select("select available from users where user_id = ?",array($id));
    echo json_encode($result);
   }

    /**
    *   Registers a new user to the DB if the ID, email, and codeword provided don't already exist
    *   @echo JSON containing the data added to the DB
    */
    public function registerUser()
    {

        //First check if user already exists
        $smuid = Input::get('smu_id');
        $email = Input::get('email');
        if(Input::has('codeword'))
        {
            $code = Input::get('codeword');
        }
        else
        {
            $code = substr(str_shuffle("abklrz32IVWZ"), 0, 1).substr(md5(time()),-10);
        }

        $query = "SELECT smu_id FROM users WHERE smu_id = ?";
        $result1 = DB::select($query,array($smuid));
        $query = "SELECT email FROM users WHERE email = ?";
        $result2 = DB::select($query,array($email));
        $query = "SELECT codeword FROM users WHERE codeword = ?";
        $result3 = DB::select($query,array($code));
        if(!empty($result1)){            
            echo "The ID provided has already been registered.";        
        }   
        elseif(!empty($result2)){            
            echo "The email address provided has already been registered.";        
        }
        elseif(!empty($result3)){            
            echo "Please provide a different codeword.";        
        }
        else
        {
            $query= "INSERT INTO users(smu_id,fName,lName,available,active,tutor,admin,email,pswd,codeword) 
                     VALUES (?,?,?,0,0,0,0,?,?,?)";
            //Create initial codeword randomly (from stackoverflow.com)
            
            
            //Submit insert
            $result=DB::insert($query,array($smuid,Input::get('fname'),Input::get('lname'),Input::get('email'),Input::get('password'),$code));
        
            //Obtain new user's info/ensure register succeeded
            $result=DB::select("SELECT * FROM users WHERE smu_id= ?",array($smuid));
            echo json_encode($result); 
        }
   }
}
?>
