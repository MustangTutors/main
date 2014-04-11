package com.example.mustangtutors;

import org.json.JSONArray;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;

public class TutorActivity extends Activity {
	
	private int id;
	private String firstName;
	private String lastName;
	private String fullName;
	private int numberRatings;
	private double rating;
	private int availability;

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
	    
	    Tutor tutor;
	    JSONObject user;
        try {
            user = new JSONObject(request.send());
            
            id = Integer.parseInt(message);
            firstName = user.getString("tutor_fName");
            lastName = user.getString("tutor_lName");
            numberRatings = Integer.parseInt(user.getString("numberOfRatings"));
            rating = Double.parseDouble(user.getString("average_rating"));
            availability = Integer.parseInt(user.getString("available"));

            fullName = firstName + " " + lastName;
            
            tutor = new Tutor(id, fullName, numberRatings, rating, availability);
            
            Log.d("BJB", fullName);
        } catch (Exception e) {
            e.printStackTrace();
        }
	    
	    // Temporary stuff. Just display the tutor user id on the page.
	    // Create the text view
	    TextView textView = new TextView(this);
	    //textView.setTextSize(40);
	    textView.setText(fullName);

	    // Set the text view as the activity layout
	    setContentView(textView);
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
