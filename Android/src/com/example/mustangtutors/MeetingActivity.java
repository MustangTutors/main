package com.example.mustangtutors;

import java.util.Calendar;

import org.json.JSONArray;
import org.json.JSONObject;

import android.app.Activity;
import android.app.DatePickerDialog;
import android.app.Dialog;
import android.app.DialogFragment;
import android.app.TimePickerDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.NavUtils;
import android.text.format.DateFormat;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TimePicker;
import android.widget.Toast;

public class MeetingActivity extends FragmentActivity {
	
	private static Button mDate;
	private static Button mStartTime;
	private static Button mEndTime;
	private EditText mSmuId;
	private EditText mSummary;
	
	private static String mDay;
	private static String mMonth;
	private static String mYear;
	private static String sHour;
	private static String sMinute;
	private static String eHour;
	private static String eMinute;
	
	private Button mSend;
	private Button mReset;
	
	private Button mMore;
	
	private Activity mContext;
	
	private Spinner mCourses;
	private String[] mCourseId;
	private String[] courses;
	
	private SharedPreferences sharedPref;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_meeting);
		
		sharedPref = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
		
		mContext = this;
		// Show the Up button in the action bar.
		setupActionBar();
		mDate = (Button) findViewById(R.id.date);
		mStartTime = (Button) findViewById(R.id.start_time);
		mEndTime = (Button) findViewById(R.id.end_time);
		mCourses = (Spinner) findViewById(R.id.course_tutored);
		
		mSmuId = (EditText) findViewById(R.id.student_id);
		mSummary = (EditText) findViewById(R.id.comments);
		
		mSend = (Button) findViewById(R.id.submit);
		mReset = (Button) findViewById(R.id.reset);
		
		mMore = (Button) findViewById(R.id.more_courses);
		
		// Set on click listener for submitting new meeting form
		mSend.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				// Send info for new meeting
				int valid = valid();
				
				if(valid == 2){
					new AddTask().execute((Void) null);
				}
				else if(valid == 0) {
					CharSequence text = "Incomplete information.";
					int duration = Toast.LENGTH_SHORT;

					Toast toast = Toast.makeText(mContext, text, duration);
					toast.show();
				}
				else if(valid == 1) {
					CharSequence text = "Invalid SMU ID.";
					int duration = Toast.LENGTH_SHORT;

					Toast toast = Toast.makeText(mContext, text, duration);
					toast.show();
				}
				else if(valid == 3) {
					CharSequence text = "Invalid time.";
					int duration = Toast.LENGTH_SHORT;

					Toast toast = Toast.makeText(mContext, text, duration);
					toast.show();
				}
			}
		});
		
		mReset.setOnClickListener(new OnClickListener() {
			
			@Override
			public void onClick(View v) {
				resetMeetingForm();
			}
		});
		
		mMore.setOnClickListener(new OnClickListener() {
			
			@Override
			public void onClick(View v) {
				if(mMore.getText().equals("More >>")){
					mMore.setText("Less <<");
					
					Context context = getApplicationContext();
					CharSequence text = "You may now choose any course the A-LEC offers.";
					int duration = Toast.LENGTH_SHORT;

					Toast toast = Toast.makeText(context, text, duration);
					toast.show();
					
					loadCourses(false);
				}
				else {
					mMore.setText("More >>");
					
					Context context = getApplicationContext();
					CharSequence text = "You may now only choose courses you tutor.";
					int duration = Toast.LENGTH_SHORT;

					Toast toast = Toast.makeText(context, text, duration);
					toast.show();
					
					loadCourses(true);
				}
			}
		});
		
		loadCourses(true);
	}

	/**
	 * Set up the {@link android.app.ActionBar}.
	 */
	private void setupActionBar() {

		getActionBar().setDisplayHomeAsUpEnabled(true);

	}
	
	private void coursesClicked() {
		if(mMore.getText().equals("More >>")){
			mMore.setText("Less <<");
			
			Context context = getApplicationContext();
			CharSequence text = "You may now choose any course the A-LEC offers.";
			int duration = Toast.LENGTH_SHORT;

			Toast toast = Toast.makeText(context, text, duration);
			toast.show();
			
			loadCourses(false);
		}
		else {
			mMore.setText("More >>");
			
			Context context = getApplicationContext();
			CharSequence text = "You may now only choose courses you tutor.";
			int duration = Toast.LENGTH_SHORT;

			Toast toast = Toast.makeText(context, text, duration);
			toast.show();
			
			loadCourses(true);
		}
	}
	
	private void loadCourses(boolean course_tutored){
		if(course_tutored){
			new PopulateCoursesLightTask().execute((Void) null);
		}
		else {
			new PopulateCoursesTask().execute((Void) null);
		}
	}
	
	private void resetMeetingForm() {
		mSmuId.setText("");
		mSummary.setText("");
		
		if(mMore.getText().equals("Less <<")){
			mMore.setText("More >>");
			loadCourses(true);
		}
		else{
			mCourses.setSelection(0);
		}
		
		mDate.setText("Date");
		mStartTime.setText("Start Time");
		mEndTime.setText("End Time");
	}
	
	private int valid() {
		String id = mSmuId.getText().toString();
		String sum = mSummary.getText().toString();
		String date = mDate.getText().toString();
		String stime = mStartTime.getText().toString();
		String etime = mEndTime.getText().toString();
		int cour = mCourses.getSelectedItemPosition();
		
		if(id.equals("") || sum.equals("") || date.equals("Date") 
				|| stime.equals("Start Time") || etime.equals("End Time") || cour == 0){
			return 0;
		}
		
		int id_num = Integer.parseInt(id);
		
		if(id_num < 10000000 || id_num > 99999999){
			return 1;
		}
		
		int start_hour = Integer.parseInt(sHour);
		int end_hour = Integer.parseInt(eHour);
		int start_min = Integer.parseInt(sMinute);
		int end_min = Integer.parseInt(eMinute);
		
		if(start_hour > end_hour)
		{
			return 3;
		}
		else if(start_hour == end_hour && start_min > end_min){
			return 3;
		}
		
		return 2;
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
			
			if(hourOfDay < 10){
				sHour = "0" + hourOfDay;
			}
			else {
				sHour = "" + hourOfDay;
			}
			
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
			sMinute = min;
			
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
		
		if(hourOfDay < 10){
			eHour = "0" + hourOfDay;
		}
		else {
			eHour = "" + hourOfDay;
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
		eMinute = min;
		
		
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
			if(day < 10){
				mDay = "0" + day;
			}
			else {
				mDay = "" + day;
			}
			
			month = month + 1;
			
			if(month < 10){
				mMonth = "0" + month;
			}
			else {
				mMonth = "" + month;
			}
			
			mYear = "" + year;
			
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
        	JSONArray json;
            try {
                json = new JSONArray(request.send());
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
    		if(result){
    			ArrayAdapter<String> adapter = new ArrayAdapter<String>(mContext, android.R.layout.simple_spinner_item, courses);
                adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                mCourses.setAdapter(adapter);
    		}
    	}
    }
    
    // AsyncTask for populating courses
    public class PopulateCoursesLightTask extends AsyncTask<Void, Void, Boolean> {
    	
    	@Override
		protected Boolean doInBackground(Void... params) {
            AjaxRequest request = new AjaxRequest("GET", "http://mustangtutors.floccul.us/Laravel/public/tutor/" + sharedPref.getString("user_id", ""));
        	JSONObject json_obj;
            try {
                json_obj = new JSONObject(request.send());
               	JSONArray json = json_obj.getJSONArray("courses");
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
    		if(result){
    			ArrayAdapter<String> adapter = new ArrayAdapter<String>(mContext, android.R.layout.simple_spinner_item, courses);
                adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                mCourses.setAdapter(adapter);
    		}
    	}
    }
    
    public class AddTask extends AsyncTask<Void, Void, Boolean> {
		@Override
		protected Boolean doInBackground(Void... params) {
			String url = "http://mustangtutors.floccul.us/Laravel/public/tutors/addMeeting/" + sharedPref.getString("user_id", "");
			System.out.println(url);
			AjaxRequest request = new AjaxRequest("POST", url);
			
			String id = mSmuId.getText().toString();
			String sum = mSummary.getText().toString();
			String date = mYear + "-" + mMonth + "-" + mDay;
			String stime = sHour + ":" + sMinute + ":00";
			String etime = eHour + ":" + eMinute + ":00";
			int cour = mCourses.getSelectedItemPosition();
			
			JSONObject json = new JSONObject();
			try {
				json.put("student_id", id);
				json.put("course_id", mCourseId[cour]);
				json.put("day", date);
				json.put("start_time", stime);
				json.put("end_time", etime);
				json.put("summary", sum);
			} catch (Exception e) {
				// TODO: handle exception
			}
			String asdf = json.toString();
			System.out.println(asdf);
	        request.addParam("post_meeting", json.toString());
            try {
	            request.send();
	            
            } catch (Exception e) {
            }
            
            return true;
		}
		
		protected void onPostExecute(Boolean result){
			resetMeetingForm();
			
			CharSequence text = "Meeting Added";
			int duration = Toast.LENGTH_SHORT;

			Toast toast = Toast.makeText(mContext, text, duration);
			toast.show();
		}
	}
}
