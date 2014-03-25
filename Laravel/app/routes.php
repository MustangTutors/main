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

users/current           ==>this returns a json of all of the current user's data
users/login             ==>this logs in a user,changes to available,sets session data,return json of user data
users/logout            ==>this logs out a user,clears session variables
users/toggle            ==>this toggles a logged in users availability between 1 and 2
users/available/{id}    ==>this returns the availability of a user based on their id
users/history           ==>this returns all of a users records for the user
users/history/parent    ==>this returns all of a users records for anyone (ie parent)
tutor/{id}              ==>this returns all of a tutors info based on their user_id
tutor/comment           ==>this adds a comment for a tutor made by the current user
users/email             ==>this sends emails to the authorized users with the codeword
tutor/search            ==>this lets you search on any or all criteria and returns a json of results
tutor/rate              ==>this adds or updates user's rating for a tutor
users/register          ==>this registers a new user
courses/subjects        ==>this returns a json of the course subjects
*/

Route::get('/', function()
{
	return View::make('hello');
});

Route::post('users/register',function()
{
    $temp= new User();
    $temp->registerUser();
});

Route::post('users/login',function()
{   
    
    $smu_id = $_POST['smu_id'];
    $password = $_POST['password'];
    $temp = new User();
    $temp->loginUser($smu_id,$password);
    
});

Route::get('users/current',function()
{
    $temp = new User();
    $temp->getCurrUserInfo();
});
Route::get('users/logout',function()
{
    $temp = new User();
    $temp->logoutUser();
});
Route::get('users',function()
{
    $temp = new User();
    $temp1 = $temp->getAuthIdentifier();	
	echo ($temp1);
});

Route::get('users/toggle',function()
{
    $temp = new User();
    $temp->toggleAvailable($_SESSION['user_id']);
});

Route::get('users/available/{id?}',function($id =-1)
{	
	$temp = new User();
	$temp->getAvailability($id);
})
->where('id','[0-9]+');

Route::get('users/history',function()
{
    //$_SESSION['smu_id'] = 1236;
    $temp = new User();
    if($_SESSION['smu_id']!= null)
    {
        $temp->getUsersRecords($_SESSION['smu_id']);
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
})
->where('id','[0-9]+');

Route::get('tutor/search',function()
{   
   $temp= new Tutor();
   $temp->searchTutors();
});

Route::post('tutor/rate',function()
{
    $temp = new Tutor();
    $temp->rateTutor();
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

Route::get('courses/subjects',function()
{
    $temp = new Course();
    $temp->getUniqueSubjects();

});




