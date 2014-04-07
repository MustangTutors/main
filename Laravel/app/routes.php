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
users/apply             ==>this adds application and (possibly) temporary schedule and course tutored list to db 
courses/subjects        ==>this returns a json of the course subjects
users/edit              ==>this updates the first name, last name, and password
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

Route::get('users/current/{id?}',function($id = '-1')
{
    $temp = new User();
    $temp->getCurrUserInfo($id);
});
Route::get('users/logout/{id?}',function($id = '-1')
{
    $temp = new User();
    $temp->logoutUser($id);
});
Route::get('users',function()
{
    $temp = new User();
    $temp1 = $temp->getAuthIdentifier();	
	echo ($temp1);
});

Route::get('users/toggle/{id?}',function($id = '-1')
{        
    $temp = new User();
    if($id == '-1'){
        $temp->toggleAvailable($_SESSION['user_id']);
    }else{
        $temp->toggleAvailable($id);
    }
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
    if(isset($_SESSION['user_id']))
    {
        $temp->getUsersRecords($_SESSION['user_id']);
    }
    else
    {
        $temp->getUsersRecords(Input::get('user_id',0));
    }
});


Route::post('users/history/parent',function()
{
    if(isset($_POST['smu_id']) &&  isset($_POST['codeword']))
    {
        $temp = new User();
        $result = $temp->checkCodeWord($_POST['smu_id'],$_POST['codeword']);
        if($result)
        {
            $temp->getUsersRecordsParent($_POST['smu_id']);
        }
    	else
    	{
	    	echo "incorrect codeword";
	    }
    }
});

Route::post('users/apply',function()
{
    if(isset($_POST['application']))
    {
        $temp = new User();
        $temp->addApplication();
    }    

});

Route::post('users/edit/{id}',function($id = -1)
{
    $temp=new User();
    $temp->updateInfo($id);
})
->where('id','[0-9]+');

Route::get('tutor/{id}',function($id)
{
    $temp = new Tutor();
    if (isset($_SESSION['user_id'])) {
        $user_id = $_SESSION['user_id'];
    }
    else {
        $user_id = 0;
    }
    $temp->getInfoForTutorsPage($user_id,$id);
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
    $date = date('Y-m-d h:m:s',time());
    $temp = new Tutor();
    $temp->addCommentForTutor($_SESSION['user_id'],$_POST['tutor_id'],$_POST['comment']);
});

Route::post('users/email',function()
{
    $temp = new User();
    $temp->sendEmailWithCodeword();
});

Route::get('courses/subjects',function()
{
    $temp = new Course();
    $temp->getUniqueSubjects();

});

Route::get('admin/applications',function(){
    $temp = new Admin();
    $temp->getApplications();
    
});

Route::get('admin/application/approved/{tutor_id}',function($tutor_id)
{   
    $temp = new Admin();
    $temp->approveTutor($tutor_id);

});
Route::get('admin/application/denied/{tutor_id}',function($tutor_id)
{   
    $temp = new Admin();
    $temp->denyTutor($tutor_id);

});
Route::get('courses/update',function()
{
    $temp = new Course();
    $temp->updateCourses();
});
Route::get('schedule/update',function()
{
    $temp = new Schedule();
    $temp->updateHours();
});

Route::get('tutors/toggle/active/{id?}',function($id = '-1')
{        
    $temp = new Tutor();
    if($id == '-1'){
        $temp->toggleActive($_SESSION['user_id']);
    }else{
        $temp->toggleActive($id);
    }
});




