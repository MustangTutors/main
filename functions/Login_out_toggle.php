<?php

Class User{

	public $user_id
	public $smu_id
	public $fName
	public $lname
	public $available
	public $active
	public $tutor
	public $admin
	public $email
	public $pswd
	public $codeword



function validateUser(){
    $user = new User();
    $smu_id = $_POST['SMU id'];
    $password = $_POST['password'];
    //Note: May not be the correct way to do this
    if($user->getUserByIDAndPassword($smu_id,$password)) $_SESSION['user_id']=$user->user_id;
    echo json_encode($user);
}

public function getUserByIDAndPassword($smuID, $pwd) {
            $attributes = $this->db->query("SELECT * FROM users WHERE smu_id=? AND pswd=?", array($smu_id, User::securePassword($pwd)));
            if(isset($attributes[0])){
               $this->_set($attributes[0]);
		$available = 2;
	       return TRUE;
            }
            return FALSE;
        }

function logOut(){
	session_destroy();
	$active = 0;
}

public function toggle($available){
	$attributes = $this->db->query("SELECT * FROM users WHERE available=?");
            if($availbe == 2){
               $this->_set($availble = 1);
		else
		$this->_set($availble = 2);
}


}

?>
