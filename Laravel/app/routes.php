<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/
/*
HERES A LIST OF THE CURRENT URLs with a brief description

users/available/{id}    ==>this returns the availability of a user based on their id
users/history           ==>this returns all of a users records for the user
users/history/parent    ==>this returns all of a users records for anyone (ie parent)
tutor/{id}              ==>this returns all of a tutors info based on their user_id
tutor/comment           ==>this adds a comment for a tutor made by the current user
users/email             ==>this sends emails to the authorized users with the codeword

*/
Route::get('/', function()
{
	return View::make('hello');
});

Route::get('users',function()
{
	return View::make('users');
});

Route::get('users/available/{id}',function($id)
{
	$result=DB::select("select available from users where user_id = ?",array($id));
	echo json_encode($result);
});

Route::get('users/history',function()
{
    $_SESSION['user_id'] = 3;
    $temp = new User();
    if($_SESSION['user_id']!= null)
    {
        $temp->getUsersRecords($_SESSION['user_id']);
    }
});

Route::post('users/history/parent',function()
{
    if($_POST['user_id']!=null &&  $_POST['codeword']!=null)
    {
        $temp = new User();
        $result = $temp->checkCodeWord($_POST['user_id'],$_POST['codeword']);
        if($result)
        {
            $temp->getUsersRecords($_POST['user_id']);
        }
    }
});

Route::get('tutor/{id}',function($id)
{
    $_SESSION['user_id'] = 3;
    $temp = new Tutor();
    $temp->getInfoForTutorsPage($_SESSION['user_id'],$id);
});

Route::post('tutor/comment',function()
{
    $_SESSION['tutor_id']= 2;
    $_SESSION['user_id'] = 3;
    $date = date('Y-m-d h:m:s',time());
    $temp = new Tutor();
    $temp->addCommentForTutor($_SESSION['user_id'],$_SESSION['tutor_id'],$_POST['comment']);
});

Route::post('users/email',function()
{
    $temp = new User();
    $user_id = "12345";
    $codeword = "codeword";
    $emails = $_POST['emails'];
    $temp->sendEmailWithCodeword($user_id,$codeword,$emails);
});




