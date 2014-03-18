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
