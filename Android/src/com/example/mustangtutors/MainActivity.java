package com.example.mustangtutors;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.StrictMode;
import android.support.v4.app.ActionBarDrawerToggle;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.inputmethod.InputMethodManager;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;

@SuppressLint("NewApi")
public class MainActivity extends Activity {
	public final static String TUTOR_ID = "com.example.mustangtutors.TUTORID";

	private Activity mContext;

	private SharedPreferences sharedPref;
	private SharedPreferences.Editor editor;
	private DrawerLayout mDrawerLayout;
	private ListView mDrawerList;
	private ActionBarDrawerToggle mDrawerToggle;
	private Menu mMenu;

	private LinearLayout mSearchProgress;
	private Button mSearchBar;
	private RelativeLayout mSearchForm;
	private Spinner mSearchSubject;
	private EditText mSearchCourseNumber;
	private EditText mSearchCourseName;
	private Button mSearchSubmit;
	private ListView mSearchResults;
	private TextView mSearchError;

	private CharSequence mDrawerTitle;
	private CharSequence mTitle;
	private String[] drawerImages;
	private int[] drawerImagesInt;
	private String[] drawerStrings;

	// Create switch
	private Switch mySwitch;

	// Populate the navigation drawer.
	public void fillNavDrawer(String type) {
		if (type.equals("logged out")) {
			drawerImages = getResources().getStringArray(
			        R.array.logged_out_menu_images);
			drawerStrings = getResources().getStringArray(
			        R.array.logged_out_menu);
		} else if (type.equals("logged in")) {
			drawerImages = getResources().getStringArray(
			        R.array.logged_in_menu_images);
			drawerStrings = getResources().getStringArray(
			        R.array.logged_in_menu);
			drawerStrings[0] = sharedPref.getString("name", "[name]");
		}

		// Convert the image names to resource IDs
		drawerImagesInt = new int[drawerImages.length];
		for (int i = 0; i < drawerImages.length; i++) {
			drawerImagesInt[i] = getResources().getIdentifier(drawerImages[i],
			        "drawable", getPackageName());
		}

		// set up the drawer's list view with items and click listener
		DrawerAdapter customAdapter = new DrawerAdapter(this,
		        R.layout.drawer_list_item, drawerImagesInt, drawerStrings);
		mDrawerList.setAdapter(customAdapter);
		mDrawerList.setOnItemClickListener(new DrawerItemClickListener());

		if (type.equals("logged out")) {
			// If the user is not logged in, 'search' is 1st in menu
			selectItem(0);
		} else if (type.equals("logged in")) {
			// If the user is logged in, 'search' is 2nd in menu
			selectItem(1);
		}
	}

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder()
		        .permitAll().build();
		StrictMode.setThreadPolicy(policy);
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		mContext = this;

		// Open preferences file
		sharedPref = this.getPreferences(Context.MODE_PRIVATE);
		editor = sharedPref.edit();

		mTitle = mDrawerTitle = getTitle();
		mDrawerLayout = (DrawerLayout) findViewById(R.id.drawer_layout);
		mDrawerList = (ListView) findViewById(R.id.left_drawer);

		// set a custom shadow that overlays the main content when the drawer
		// opens
		mDrawerLayout.setDrawerShadow(R.drawable.drawer_shadow,
		        GravityCompat.START);

		// enable ActionBar app icon to behave as action to toggle nav drawer
		getActionBar().setDisplayHomeAsUpEnabled(true);
		getActionBar().setHomeButtonEnabled(true);

		// ActionBarDrawerToggle ties together the the proper interactions
		// between the sliding drawer and the action bar app icon
		mDrawerToggle = new ActionBarDrawerToggle(this, /* host Activity */
		mDrawerLayout, /* DrawerLayout object */
		R.drawable.ic_drawer, /* nav drawer image to replace 'Up' caret */
		R.string.drawer_open, /* "open drawer" description for accessibility */
		R.string.drawer_close /* "close drawer" description for accessibility */
		) {
			public void onDrawerClosed(View view) {
				getActionBar().setTitle(mTitle);
				// invalidateOptionsMenu(); // creates call to
				// onPrepareOptionsMenu()
			}

			public void onDrawerOpened(View drawerView) {
				getActionBar().setTitle(mDrawerTitle);
				// invalidateOptionsMenu(); // creates call to
				// onPrepareOptionsMenu()
			}
		};
		mDrawerLayout.setDrawerListener(mDrawerToggle);

		// Fill the navigation drawer with items, depending on whether the
		// user is logged in or out.
		if (sharedPref.contains("user_id")) {
			fillNavDrawer("logged in");
		} else {
			fillNavDrawer("logged out");
		}

		// Get views in search form
		mSearchProgress = (LinearLayout) findViewById(R.id.search_status);
		mSearchBar = (Button) findViewById(R.id.SearchBar);
		mSearchForm = (RelativeLayout) findViewById(R.id.SearchForm);
		mSearchSubject = (Spinner) findViewById(R.id.SearchSubject);
		mSearchCourseNumber = (EditText) findViewById(R.id.SearchCourseNumber);
		mSearchCourseName = (EditText) findViewById(R.id.SearchCourseName);
		mSearchSubmit = (Button) findViewById(R.id.SearchSubmit);
		mSearchError = (TextView) findViewById(R.id.SearchNoResults);
		mSearchResults = (ListView) findViewById(R.id.listview);

		// Set on click listener for search bar. Shows/hides search form.
		mSearchBar.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				if (mSearchForm.getVisibility() == View.GONE) {
					showSearchForm();
				} else {
					hideSearchForm();
				}
			}
		});

		// Set on click listener for submitting search form
		mSearchSubmit.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				// Hide the search form
				hideSearchForm();

				// Show tutors found
				new SearchTask().execute((Void) null);
			}
		});

		// Populate course subjects
		new PopulateSubjectsTask().execute((Void) null);

		// When the activity first loads, get all the tutors.
		new SearchTask().execute((Void) null);
	}

	@Override
	protected void onResume() {
		super.onResume();
		if (mySwitch != null) {
			// Set availability from DB
			new SetToggleTask().execute((Void) null);
		}
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		MenuInflater inflater = getMenuInflater();
		inflater.inflate(R.menu.main, menu);
		mMenu = menu;

		// Create switch
		mySwitch = (Switch) menu.findItem(R.id.mySwitch).getActionView();

		// Change text of switch
		mySwitch.setTextOff("Busy");
		mySwitch.setTextOn("Available");

		// Set availability from DB
		new SetToggleTask().execute((Void) null);

		// Create listener for availability
		mySwitch.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				new ToggleTask().execute((Void) null);
			}
		});

		return super.onCreateOptionsMenu(menu);
	}

	/* Called whenever we call invalidateOptionsMenu() */
	@Override
	public boolean onPrepareOptionsMenu(Menu menu) {
		if (sharedPref.contains("user_id")) {
			menu.findItem(R.id.mySwitch).setVisible(true);
			// TODO
			// check if logged in (using Android shared preferences)
			// get availability from db

			// set checked state on toggle
		} else {
			menu.findItem(R.id.mySwitch).setVisible(false);
		}
		return super.onPrepareOptionsMenu(menu);
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		// The action bar home/up action should open or close the drawer.
		// ActionBarDrawerToggle will take care of this.
		if (mDrawerToggle.onOptionsItemSelected(item)) {
			return true;
		}
		// Handle action buttons
		switch (item.getItemId()) {
		default:
			return super.onOptionsItemSelected(item);
		}
	}

	/* The click listener for ListView in the navigation drawer */
	private class DrawerItemClickListener implements
	        ListView.OnItemClickListener {
		@Override
		public void onItemClick(AdapterView<?> parent, View view, int position,
		        long id) {
			selectItem(position);
		}
	}

	private void selectItem(int position) {
		// Start the login activity
		if (drawerStrings[position].equals("Login as a Tutor")) {
			Intent intent = new Intent(this, LoginActivity.class);
			int requestCode = 1;
			startActivityForResult(intent, requestCode);
		}

		// Start the tutor profile activity
		if (drawerStrings[position].equals(sharedPref.getString("name",
		        "[name]"))) {
			// code
			System.out.println("tutor profile");
			Intent intent = new Intent(this, TutorActivity.class);
			intent.putExtra(TUTOR_ID, sharedPref.getString("user_id", ""));
			startActivity(intent);
		}

		// Start the meeting documentation activity
		else if (drawerStrings[position].equals("Document a Student Meeting")) {
			// code
			System.out.println("document meeting");
			Intent intent = new Intent(this, MeetingActivity.class);
			startActivity(intent);
		}

		// Logout
		else if (drawerStrings[position].equals("Logout")) {
			// Send a logout request to the server
			new LogoutTask().execute((Void) null);

			return;
		}

		// Highlight the item in the drawer, then close the drawer.
		mDrawerList.setItemChecked(position, true);
		mDrawerLayout.closeDrawer(mDrawerList);
	}

	/* The click listener for ListView in the search results */
	private class SearchItemClickListener implements
	        ListView.OnItemClickListener {
		@Override
		public void onItemClick(AdapterView<?> parent, View view, int position,
		        long id) {
			Intent intent = new Intent(mContext, TutorActivity.class);
			intent.putExtra(TUTOR_ID, "" + id);
			startActivity(intent);
		}
	}

	// Process data received from other activities (login)
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		if (requestCode == 1) {
			String value = data.getStringExtra(LoginActivity.EXTRA_MESSAGE);
			if (value.equals("logged in")) {
				// Write user data to the preferences file.
				editor.putString("user_id",
				        data.getStringExtra(LoginActivity.USER_ID));
				editor.putString("name",
				        data.getStringExtra(LoginActivity.NAME));
				editor.putString("availability", "2");
				editor.commit();

				// Update the navigation drawer with links for a logged in user.
				fillNavDrawer("logged in");

				// Show the toggle availability switch and set it.
				mMenu.findItem(R.id.mySwitch).setVisible(true);
				mySwitch.setChecked(true);

				// Show a login toast
				Toast.makeText(getApplicationContext(),
				        getString(R.string.logged_in), Toast.LENGTH_SHORT)
				        .show();

				// Refresh search results to show updated availability
				new SearchTask().execute((Void) null);
			}
		}
	}

	@Override
	public void setTitle(CharSequence title) {
		mTitle = title;
		getActionBar().setTitle(mTitle);
	}

	/**
	 * When using the ActionBarDrawerToggle, you must call it during
	 * onPostCreate() and onConfigurationChanged()...
	 */

	@Override
	protected void onPostCreate(Bundle savedInstanceState) {
		super.onPostCreate(savedInstanceState);
		// Sync the toggle state after onRestoreInstanceState has occurred.
		mDrawerToggle.syncState();
	}

	@Override
	public void onConfigurationChanged(Configuration newConfig) {
		super.onConfigurationChanged(newConfig);
		// Pass any configuration change to the drawer toggls
		mDrawerToggle.onConfigurationChanged(newConfig);
	}

	private void showSearchForm() {
		// Show the search form
		mSearchForm.setVisibility(View.VISIBLE);
		// Change the arrow on search bar to point up
		mSearchBar.setCompoundDrawablesRelativeWithIntrinsicBounds(0, 0,
		        R.drawable.up, 0);
	}

	private void hideSearchForm() {
		// Hide the search form
		mSearchForm.setVisibility(View.GONE);
		// Change the arrow on search bar to point down
		mSearchBar.setCompoundDrawablesRelativeWithIntrinsicBounds(0, 0,
		        R.drawable.down, 0);
	}

	// AsyncTask for populating subjects
	public class PopulateSubjectsTask extends AsyncTask<Void, Void, Boolean> {
		private String subjects[];

		@Override
		protected Boolean doInBackground(Void... params) {
			AjaxRequest request = new AjaxRequest("GET",
			        "http://mustangtutors.floccul.us/Laravel/public/courses/subjects");
			JSONArray json;
			try {
				json = new JSONArray(request.send());
				subjects = new String[json.length() + 1];
				subjects[0] = "Subject";
				for (int i = 0; i < json.length(); i++) {
					JSONObject subject = (JSONObject) json.get(i);
					subjects[i + 1] = subject.getString("subject");
				}
			} catch (Exception e) {
			}
			return true;
		}

		@Override
		protected void onPostExecute(Boolean result) {
			ArrayAdapter<String> adapter = new ArrayAdapter<String>(mContext,
			        android.R.layout.simple_spinner_item, subjects);
			adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
			mSearchSubject.setAdapter(adapter);
		}
	}

	// AsyncTask for logging out
	public class LogoutTask extends AsyncTask<Void, Void, Boolean> {
		@Override
		protected Boolean doInBackground(Void... params) {
			AjaxRequest request = new AjaxRequest("GET",
			        "http://mustangtutors.floccul.us/Laravel/public/users/logout/"
			                + sharedPref.getString("user_id", ""));
			request.send();
			return true;
		}

		@Override
		protected void onPostExecute(Boolean result) {
			// Delete user data from preferences
			editor.clear().commit();

			// Update navigation drawer
			fillNavDrawer("logged out");

			// Hide the toggle availability switch
			mMenu.findItem(R.id.mySwitch).setVisible(false);

			// Show a logout toast
			Toast.makeText(getApplicationContext(),
			        getString(R.string.logged_out), Toast.LENGTH_SHORT).show();

			// Refresh the search results (to show updated availability)
			new SearchTask().execute((Void) null);
		}
	}

	// AsyncTask for setting the availability switch based on current
	// availability
	public class SetToggleTask extends AsyncTask<Void, Void, Integer> {
		@Override
		protected Integer doInBackground(Void... params) {
			AjaxRequest request = new AjaxRequest("GET",
			        "http://mustangtutors.floccul.us/Laravel/public/users/available/"
			                + sharedPref.getString("user_id", ""));
			JSONArray json;
			try {
				json = new JSONArray(request.send());
				JSONObject availability = (JSONObject) json.get(0);
				String available = availability.getString("available");
				if (available.equals("2")) {
					return 2;
				} else if (available.equals("1")) {
					return 1;
				}
			} catch (Exception e) {
			}

			return 0;
		}

		@Override
		protected void onPostExecute(Integer result) {
			if (result == 2) {
				mySwitch.setChecked(true);
			} else if (result == 1) {
				mySwitch.setChecked(false);
			} else {
				new ToggleTask().execute((Void) null);
			}
		}
	}

	// AsyncTask for toggling availability
	public class ToggleTask extends AsyncTask<Void, Void, Boolean> {
		@Override
		protected Boolean doInBackground(Void... params) {
			// Toggle the availability of the current user in the database
			AjaxRequest request = new AjaxRequest("GET",
			        "http://mustangtutors.floccul.us/Laravel/public/users/toggle/"
			                + sharedPref.getString("user_id", ""));
			request.send();
			Log.d("scz", "toggled");
			return true;
		}

		@Override
		protected void onPostExecute(Boolean result) {
			new SearchTask().execute((Void) null);
		}
	}

	// AsyncTask for searching for tutors
	public class SearchTask extends AsyncTask<Void, Void, Boolean> {
		private ArrayList<Tutor> tutors;

		@Override
		protected void onPreExecute() {
			// Hide keyboard
			hideSoftKeyboard(mContext);
			// Show loading message, hide tutors, hide error message
			mSearchProgress.setVisibility(View.VISIBLE);
			mSearchResults.setVisibility(View.GONE);
			mSearchError.setVisibility(View.GONE);
		}

		@Override
		protected Boolean doInBackground(Void... params) {
			// Get search parameters
			String subject = mSearchSubject.getItemAtPosition(
			        mSearchSubject.getSelectedItemPosition()).toString();
			String number = mSearchCourseNumber.getText().toString();
			String name = mSearchCourseName.getText().toString();

			tutors = getTutors(subject, number, name);
			if (!tutors.isEmpty()) {
				return true;
			}
			return false;
		}

		@Override
		protected void onPostExecute(Boolean result) {
			SearchAdapter searchAdapter = new SearchAdapter(mContext,
			        R.layout.search_list_item, tutors);
			mSearchResults.setAdapter(searchAdapter);
			mSearchResults
			        .setOnItemClickListener(new SearchItemClickListener());

			// Hide loading message, show tutors
			mSearchProgress.setVisibility(View.GONE);
			mSearchResults.setVisibility(View.VISIBLE);

			// Show error message if needed
			if (!result) {
				mSearchError.setVisibility(View.VISIBLE);
			}
		}
	}

	public ArrayList<Tutor> getTutors(String subject, String number, String name) {
		ArrayList<Tutor> tutors = new ArrayList<Tutor>();

		AjaxRequest request = new AjaxRequest("GET",
		        "http://mustangtutors.floccul.us/Laravel/public/tutor/search");
		if (!subject.isEmpty() && !subject.equals("Subject")) {
			request.addParam("subject", subject);
		}
		if (!number.isEmpty()) {
			request.addParam("cnumber", number);
		}
		if (!name.isEmpty()) {
			request.addParam("cname", name);
		}
		JSONArray json;
		try {
			json = new JSONArray(request.send());
			for (int i = 0; i < json.length(); i++) {
				JSONObject tutor = (JSONObject) json.get(i);
				int id = Integer.parseInt(tutor.getString("User_ID"));
				String tutorName = tutor.getString("First_Name") + " "
				        + tutor.getString("Last_Name");
				int numRatings = Integer.parseInt(tutor
				        .getString("Number_Ratings"));
				double rating;
				if (numRatings == 0) {
					rating = 0;
				} else {
					rating = Double.parseDouble(tutor
					        .getString("Average_Rating"));
				}
				System.out.println(rating);
				int availability = Integer.parseInt(tutor
				        .getString("Available"));
				Bitmap image = loadImageFromNetwork("http://mustangtutors.floccul.us/img/tutors/"
				        + id + ".jpg");

				tutors.add(new Tutor(id, tutorName, numRatings, rating,
				        availability, image));
			}
		} catch (Exception e) {
		}

		return tutors;
	}

	public Bitmap loadImageFromNetwork(String imgUrl) {
		Bitmap img = null;
		URL url;
		try {
			url = new URL(imgUrl);
			img = BitmapFactory.decodeStream(url.openStream());
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return img;
	}

	public static void hideSoftKeyboard(Activity activity) {
		if (activity != null) {
			try {
				InputMethodManager inputMethodManager = (InputMethodManager) activity
				        .getSystemService(Activity.INPUT_METHOD_SERVICE);
				inputMethodManager.hideSoftInputFromWindow(activity
				        .getCurrentFocus().getWindowToken(), 0);
			} catch (Exception e) {

			}
		}
	}
}