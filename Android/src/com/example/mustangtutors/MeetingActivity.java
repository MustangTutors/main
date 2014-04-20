package com.example.mustangtutors;

import java.util.Calendar;

import org.json.JSONArray;
import org.json.JSONObject;

import android.app.Activity;
import android.app.DatePickerDialog;
import android.app.Dialog;
import android.app.DialogFragment;
import android.app.TimePickerDialog;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.NavUtils;
import android.text.format.DateFormat;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.Spinner;
import android.widget.TimePicker;

public class MeetingActivity extends FragmentActivity {
	
	private static Button mDate;
	private static Button mStartTime;
	private static Button mEndTime;
	
	private Activity mContext;
	
	private Spinner mCourses;
	private String[] mCourseId;
	private String[] courses;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_meeting);
		
		Log.d("scz", "here2");
		
		mContext = this;
		// Show the Up button in the action bar.
		setupActionBar();
		mDate = (Button) findViewById(R.id.date);
		mStartTime = (Button) findViewById(R.id.start_time);
		mEndTime = (Button) findViewById(R.id.end_time);
		mCourses = (Spinner) findViewById(R.id.course_tutored);
	}

	/**
	 * Set up the {@link android.app.ActionBar}.
	 */
	private void setupActionBar() {

		getActionBar().setDisplayHomeAsUpEnabled(true);

	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.meeting, menu);
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		switch (item.getItemId()) {
		case android.R.id.home:
			// This ID represents the Home or Up button. In the case of this
			// activity, the Up button is shown. Use NavUtils to allow users
			// to navigate up one level in the application structure. For
			// more details, see the Navigation pattern on Android Design:
			//
			// http://developer.android.com/design/patterns/navigation.html#up-vs-back
			//
			NavUtils.navigateUpFromSameTask(this);
			return true;
		}
		return super.onOptionsItemSelected(item);
	}
	
	public static class StartTimePickerFragment extends DialogFragment
	    implements TimePickerDialog.OnTimeSetListener {
	
		@Override
		public Dialog onCreateDialog(Bundle savedInstanceState) {
			// Use the current time as the default values for the picker
			final Calendar c = Calendar.getInstance();
			int hour = c.get(Calendar.HOUR_OF_DAY);
			int minute = c.get(Calendar.MINUTE);
			
			// Create a new instance of TimePickerDialog and return it
			return new TimePickerDialog(getActivity(), this, hour, minute,
					DateFormat.is24HourFormat(getActivity()));
		}
			
		public void onTimeSet(TimePicker view, int hourOfDay, int minute) {
			// Do something with the time chosen by the user
			String amPM = "";
			
			if(hourOfDay == 0){
				hourOfDay = 12;
			}
			
			if(hourOfDay > 12){
				hourOfDay = hourOfDay - 12;
				amPM = "PM";
			}
			else{
				amPM = "AM";
			}
			
			String min = "" + minute;
			if(minute < 10){
				min = "0" + minute;
			}
			
			String time = hourOfDay + ":" + min + " " + amPM;
			
			mStartTime.setText(time);
		}
	}
	
	public void showStartTimePickerDialog(View v) {
	    DialogFragment newFragment = new StartTimePickerFragment();
	    newFragment.show(getFragmentManager(), "timePicker");
	}
	
	public static class EndTimePickerFragment extends DialogFragment
    implements TimePickerDialog.OnTimeSetListener {

	@Override
	public Dialog onCreateDialog(Bundle savedInstanceState) {
		// Use the current time as the default values for the picker
		final Calendar c = Calendar.getInstance();
		int hour = c.get(Calendar.HOUR_OF_DAY);
		int minute = c.get(Calendar.MINUTE);
		
		// Create a new instance of TimePickerDialog and return it
		return new TimePickerDialog(getActivity(), this, hour, minute,
				DateFormat.is24HourFormat(getActivity()));
	}
		
	public void onTimeSet(TimePicker view, int hourOfDay, int minute) {
		// Do something with the time chosen by the user
		String amPM = "";
		
		if(hourOfDay > 12){
			hourOfDay = hourOfDay - 12;
			amPM = "PM";
		}
		else{
			amPM = "AM";
		}
		
		String min = "" + minute;
		if(minute < 10){
			min = "0" + minute;
		}
		
		String time = hourOfDay + ":" + min + " " + amPM;
		
		mEndTime.setText(time);
	}
}
	
	public void showEndTimePickerDialog(View v){
		DialogFragment newFragment = new EndTimePickerFragment();
	    newFragment.show(getFragmentManager(), "timePicker");
	}
	
	public static class DatePickerFragment extends DialogFragment
	    implements DatePickerDialog.OnDateSetListener {
		private String dateString = "";
	
		@Override
		public Dialog onCreateDialog(Bundle savedInstanceState) {
			// Use the current date as the default date in the picker
			final Calendar c = Calendar.getInstance();
			int year = c.get(Calendar.YEAR);
			int month = c.get(Calendar.MONTH);
			int day = c.get(Calendar.DAY_OF_MONTH);
			
			
			// Create a new instance of DatePickerDialog and return it
			return new DatePickerDialog(getActivity(), this, year, month, day);
		}
		
		public void onDateSet(DatePicker view, int year, int month, int day) {
			// Do something with the date chosen by the user
			month = month + 1;
			dateString = month + "/" + day + "/" + year;
			mDate.setText(dateString);
		}
	}
	
	public void showDatePickerDialog(View v) {
	    DatePickerFragment newFragment = new DatePickerFragment();
	    newFragment.show(getFragmentManager(), "datePicker");
	}
	
	// AsyncTask for populating courses
    public class PopulateCoursesTask extends AsyncTask<Void, Void, Boolean> {
    	
    	@Override
		protected Boolean doInBackground(Void... params) {
            AjaxRequest request = new AjaxRequest("GET", "http://mustangtutors.floccul.us/Laravel/public/courses/showAll");
            Log.d("scz", "here");
        	JSONArray json;
            try {
                json = new JSONArray(request.send());
                Log.d("scz", json.toString());
                courses = new String[json.length()+1];
                mCourseId = new String[json.length()+1];
                courses[0] = "Select a Course";
                mCourseId[0] = "";
                for (int i = 0; i < json.length(); i++) {
                	JSONObject course = (JSONObject) json.get(i);
                	courses[i+1] = course.getString("subject") + " " + course.getString("course_number") + ": " + course.getString("course_name");
                	mCourseId[i+1] = "" + course.getString("course_id");
                }
            } catch (Exception e) {
            	return false;
            }
            return true;
		}
    	
    	@Override
    	protected void onPostExecute(Boolean result) {
    		Log.d("scz", "here1");
    		if(result){
    			ArrayAdapter<String> adapter = new ArrayAdapter<String>(mContext, android.R.layout.simple_spinner_item, courses);
                adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                mCourses.setAdapter(adapter);
    		}
    	}
    }
    
    public class UserLoginTask extends AsyncTask<Void, Void, Boolean> {
		@Override
		protected Boolean doInBackground(Void... params) {
			AjaxRequest request = new AjaxRequest("POST", "http://mustangtutors.floccul.us/Laravel/public/tutors/addMeeting");
	        request.addParam("smu_id", "12341234");
			request.addParam("course_id", "1");
			request.addParam("day", "2014-12-12");
			request.addParam("start_time", "19:00:00");
			request.addParam("end_time", "20:00:00");
			request.addParam("summary", "Words words words.");
            try {
	            request.send();
            } catch (Exception e) {
            }
            
            return true;
		}

		@Override
		protected void onCancelled() {
//			mAuthTask = null;
//			showProgress(false);
		}
	}
}
