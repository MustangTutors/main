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


    public function getCurrUserInfo(){
        if(isset($_SESSION['user_id'])){
            $result = DB::select("select * from users where user_id = ?",array($_SESSION['user_id']));
            echo json_encode($result);
        }
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
            echo ("balls");
        }
    }
    
    //logout a user by setting availability to 0 and clearing session variables
    public function logoutUser()
    {        
        if(isset($_SESSION['user_id'])){
            DB::update("update users SET available = 0 WHERE user_id = ?",array($_SESSION['user_id']));
            session_destroy();
            echo ("you are successfully logged out");
        }else{
            echo ("no user is logged in");
        }
        
    }
    
    //toggle availability for a tutor
    public function toggleAvailable(){
        $result = DB::select("select * from users where user_id = ?",array($_SESSION['user_id']));
        if($result[0]->available != 1)
            DB::update("update users SET available = 1 WHERE user_id = ?",array($_SESSION['user_id']));
        else
            DB::update("update users SET available = 2 WHERE user_id = ?",array($_SESSION['user_id']));

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
    public function checkCodeWord($user_id,$codeword)
    {
        $result=DB::select("select user_id from users where user_id = ? AND codeword = ?",array($user_id,$codeword));
        if($result[0]->user_id == $user_id)
        {
            return true;
        }
        else
            return false;
    }
    
    /**
    * get a user's records based on their user_id
    *
    * @echo these users in a JSON
    */
    public function getUsersRecords($user_id)
    {
        $result=DB::select("select * from records where user_id = ?",array($user_id));
        echo json_encode($result);

    }
    
    /**
    * send a user's id and codeword to a list of email addresses
    *
    */
    public function sendEmailWithCodeword($user_id,$codeword,$emails){
    
        foreach($emails as $email)
        {
            echo($email);
            Mail::later(5,'emails.codeword.codeword', array('user_id'=>$user_id,'codeword'=>$codeword), function($message) use ($email){
                $message->to($email)->subject('email tester');
            });
        }
    }

   /**
   * Get the availability status of the user of the given ID, or the current user if no ID is provided.
   * @param $id INT the id of the user whose status is to be retrieved
   * @echo JSON containing the availability status
   */
   public function getAvailability($id = -1)
   {
    if($id == -1) $id = Session::get('user_id', -1);
    $result=DB::select("select available from users where user_id = ?",array($id));
    echo json_encode($result);
   }

    /**
    *   Registers a new user to the DB if the ID provided doesn't already exist
    *   @return JSON containing the data added to the DB
    */
    public function registerUser()
    {
        //First check if user already exists
        $smuid = Input::get('smu_id');
    
        $query = "SELECT * FROM users WHERE smu_id = ?";
        $result = DB::select($query,array($smuid));
        if(!empty($result)){
            echo "The ID provided has already been registered.";        
        }   
        $query= "INSERT INTO users(smu_id,fName,lName,available,active,tutor,admin,email,pswd,codeword) 
                 VALUES (?,?,?,0,0,0,0,?,?,?)"
        //Create initial codeword randomly (from stackoverflow.com)
        $code = substr(str_shuffle("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 1).substr(md5(time()),1);
        
        //Submit insert
        $result=DB::insert($query,array($smuid,Input::get('fname'),Input::get('lname'),0,0,0,0,Input::get('email'),Input::get('password'),$code));
    
        //Obtain new user's info/ensure register succeeded
        return json_encode(DB::select("SELECT * FROM users WHERE smu_id= ?",array($smuid)); 
   }
}
?>
