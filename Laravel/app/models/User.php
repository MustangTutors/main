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

}
?>