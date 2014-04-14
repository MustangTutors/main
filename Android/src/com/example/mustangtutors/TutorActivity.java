package com.example.mustangtutors;

import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.ViewGroup.LayoutParams;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RatingBar;
import android.widget.TextView;

public class TutorActivity extends Activity {
	
    Tutor tutor;
	
	private int id;
	private String firstName;
	private String lastName;
	private String fullName;
	private int numberRatings;
	private float rating;
	private int availability;
	private ArrayList<Course> courses;
	private ArrayList<Hours> hours;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_tutor);
		// Show the Up button in the action bar.
		setupActionBar();
		
		// Get the tutor user id (this is the tutor to show on this page)
	    Intent intent = getIntent();
	    String message = intent.getStringExtra(MainActivity.TUTOR_ID);
	    
	    // Send an AJAX Request to the server to retrieve information on tutor
	    String url = "http://mustangtutors.floccul.us/Laravel/public/tutor/" + message;
	    AjaxRequest request = new AjaxRequest("GET", url);
	    
	    JSONObject user;
        try {
            user = new JSONObject(request.send());
            
            id = Integer.parseInt(message);
            firstName = user.getString("tutor_fName");
            lastName = user.getString("tutor_lName");
            numberRatings = Integer.parseInt(user.getString("numberOfRatings"));
            rating = Float.parseFloat(user.getString("average_rating"));
            availability = Integer.parseInt(user.getString("available"));
            
            fullName = firstName + " " + lastName;
            
            JSONArray jsonCourses = user.getJSONArray("courses");
            courses = new ArrayList<Course>();
            
            for(int i = 0; i < jsonCourses.length(); i++) {
            	JSONObject newCourse = (JSONObject)jsonCourses.get(i);
            	String courseSubject = newCourse.getString("subject");
            	String courseNumber = newCourse.getString("course_number");
            	String courseName = newCourse.getString("course_name");
            	courses.add(new Course(courseSubject, courseNumber, courseName));
            }
            
            JSONArray jsonHours = user.getJSONArray("hours");
            hours = new ArrayList<Hours>();
            
            for(int i = 0; i < jsonHours.length(); i++) {
            	JSONObject newHours = (JSONObject)jsonHours.get(i);
            	String day = newHours.getString("day");
            	String startTime = newHours.getString("start_time");
            	String endTime = newHours.getString("end_time");
            	hours.add(new Hours(day, startTime, endTime));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
	    
        tutor = new Tutor(id, fullName, numberRatings, rating, availability);
        
        ImageView tutorPicture = (ImageView)findViewById(R.id.tutor_picture);
        TextView tutorName = (TextView)findViewById(R.id.tutor_name);
        RatingBar tutorRating = (RatingBar)findViewById(R.id.tutor_rating);
        TextView tutorAvailability = (TextView)findViewById(R.id.tutor_availability);
             
        tutorName.setText(fullName);
        
        new DownloadImageTask(tutorPicture)
    	.execute("http://mustangtutors.floccul.us/img/tutors/" + id + ".jpg");
        
        tutorRating.setRating(rating);
        
        switch (tutor.getAvailability()) {
	    	case 2:  tutorAvailability.setText("Available");
	    			 tutorAvailability.setBackgroundResource(R.drawable.border_available);
	    			 break;
	    	case 1:  tutorAvailability.setText("Busy");
			 		 tutorAvailability.setBackgroundResource(R.drawable.border_busy);
					 break;
	    	default: tutorAvailability.setText("Unavailable");
	    			 tutorAvailability.setBackgroundResource(R.drawable.border_unavailable);
	    			 break;
        }
        
        LinearLayout courselayout = (LinearLayout)findViewById(R.id.tutor_courses);
        LinearLayout hourlayout = (LinearLayout)findViewById(R.id.tutor_hours);
        
        for(int i = 0; i < courses.size(); i++) {
        	TextView courseview = new TextView(this);
        	courseview.setLayoutParams(new LinearLayout.LayoutParams
        			(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT));
        	courseview.setText(courses.get(i).toString());
        	courselayout.addView(courseview);
        }
        
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
		getMenuInflater().inflate(R.menu.tutor, menu);
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		switch (item.getItemId()) {
		case android.R.id.home:
			onBackPressed();
			return true;
		}
		return super.onOptionsItemSelected(item);
	}

}
