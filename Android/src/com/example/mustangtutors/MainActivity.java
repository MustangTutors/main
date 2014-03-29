package com.example.mustangtutors;

import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Configuration;
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
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.Switch;
import android.widget.Toast;

@SuppressLint("NewApi")
public class MainActivity extends Activity {
	private SharedPreferences sharedPref;
	private SharedPreferences.Editor editor;
    private DrawerLayout mDrawerLayout;
    private ListView mDrawerList;
    private ActionBarDrawerToggle mDrawerToggle;
    private Menu mMenu;

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
    		drawerImages = getResources().getStringArray(R.array.logged_out_menu_images);
        	drawerStrings = getResources().getStringArray(R.array.logged_out_menu);
    	}
    	else if (type.equals("logged in")) {
    		drawerImages = getResources().getStringArray(R.array.logged_in_menu_images);
        	drawerStrings = getResources().getStringArray(R.array.logged_in_menu);
        	drawerStrings[0] = sharedPref.getString("name", "[name]");
    	}
    	
    	// Convert the image names to resource IDs
    	drawerImagesInt = new int[drawerImages.length];
    	for (int i = 0; i < drawerImages.length; i++) {
    		drawerImagesInt[i] = getResources().getIdentifier(drawerImages[i], "drawable", getPackageName());
    	}
    	
        // set up the drawer's list view with items and click listener
    	DrawerAdapter customAdapter = new DrawerAdapter(this, R.layout.drawer_list_item, drawerImagesInt, drawerStrings);
        mDrawerList.setAdapter(customAdapter);
        mDrawerList.setOnItemClickListener(new DrawerItemClickListener());
        
        if (type.equals("logged out")) {
        	// If the user is not logged in, 'search' is 1st in menu
        	selectItem(0);
        }
        else if (type.equals("logged in")) {
        	// If the user is logged in, 'search' is 2nd in menu
        	selectItem(1);
        }
    }
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
    	StrictMode.ThreadPolicy policy = new StrictMode.
    			ThreadPolicy.Builder().permitAll().build();
    			StrictMode.setThreadPolicy(policy); 
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Open preferences file
        sharedPref = this.getPreferences(Context.MODE_PRIVATE);
		editor = sharedPref.edit();
		
        mTitle = mDrawerTitle = getTitle();
        mDrawerLayout = (DrawerLayout) findViewById(R.id.drawer_layout);
        mDrawerList = (ListView) findViewById(R.id.left_drawer);

        // set a custom shadow that overlays the main content when the drawer opens
        mDrawerLayout.setDrawerShadow(R.drawable.drawer_shadow, GravityCompat.START);

        // enable ActionBar app icon to behave as action to toggle nav drawer
        getActionBar().setDisplayHomeAsUpEnabled(true);
        getActionBar().setHomeButtonEnabled(true);

        // ActionBarDrawerToggle ties together the the proper interactions
        // between the sliding drawer and the action bar app icon
        mDrawerToggle = new ActionBarDrawerToggle(
                this,                  /* host Activity */
                mDrawerLayout,         /* DrawerLayout object */
                R.drawable.ic_drawer,  /* nav drawer image to replace 'Up' caret */
                R.string.drawer_open,  /* "open drawer" description for accessibility */
                R.string.drawer_close  /* "close drawer" description for accessibility */
                ) {
            public void onDrawerClosed(View view) {
                getActionBar().setTitle(mTitle);
                //invalidateOptionsMenu(); // creates call to onPrepareOptionsMenu()
            }

            public void onDrawerOpened(View drawerView) {
                getActionBar().setTitle(mDrawerTitle);
                //invalidateOptionsMenu(); // creates call to onPrepareOptionsMenu()
            }
        };
        mDrawerLayout.setDrawerListener(mDrawerToggle);

        // Fill the navigation drawer with items, depending on whether the 
        // user is logged in or out.
    	if (sharedPref.contains("user_id")) {
            fillNavDrawer("logged in");
    	}
    	else {
            fillNavDrawer("logged out");
    	}
    	
    	AjaxRequest request = new AjaxRequest("GET", "http://mustangtutors.floccul.us/json/searchResults.json");
    	JSONObject json;
        try {
            json = new JSONObject(request.send());
            JSONArray jsonTutors = json.getJSONArray("Tutors");
		    ArrayList<Tutor> tutors = new ArrayList<Tutor>();
		    for (int i = 0; i < jsonTutors.length(); i++) {
		    	JSONObject tutor = (JSONObject) jsonTutors.get(i);
		    	int id = tutor.getInt("User_ID");
		    	String name = tutor.getString("First_Name") + " " + tutor.getString("Last_Name");
		    	int numRatings = tutor.getInt("Number_Ratings");
		    	double rating = tutor.getDouble("Average_Rating");
		    	int availability = tutor.getInt("Available");
		    	tutors.add(new Tutor(id, name, numRatings, rating, availability));
		    	
		    }
	    	tutors.add(new Tutor(7, "Test Test", 0, 0, 2));
	    	SearchAdapter searchAdapter = new SearchAdapter(this, R.layout.search_list_item, tutors);
	    	ListView listView = (ListView) findViewById(R.id.listview);
	    	listView.setAdapter(searchAdapter);
        } catch (Exception e) {
        }
        
    }
    
    @Override
    protected void onResume() {
    	super.onResume();
    	// TODO
    	// check if logged in (using Android shared preferences)
    	
    	if(mySwitch != null)
    	{
    		// Set availability from DB
            int availability = getAvailability();
            if(availability == 2){
            	mySwitch.setChecked(true);
            } else if(availability == 1){
            	mySwitch.setChecked(false);
            } else {
            	toggleAvailability();
            }
    	}
    	
    	// set checked state on toggle
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
        int availability = getAvailability();
        if(availability == 2){
        	mySwitch.setChecked(true);
        } else if(availability == 1){
        	mySwitch.setChecked(false);
        } else {
        	toggleAvailability();
        }
        
        // Create listener for availability
        mySwitch.setOnClickListener(new OnClickListener(){
            @Override
            public void onClick(View v) {
	        	toggleAvailability();
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
    	}
    	else {
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
        switch(item.getItemId()) {
        default:
            return super.onOptionsItemSelected(item);
        }
    }

    /* The click listener for ListView in the navigation drawer */
    private class DrawerItemClickListener implements ListView.OnItemClickListener {
        @Override
        public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
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
    	if (drawerStrings[position].equals(sharedPref.getString("name", "[name]"))) {
    		// code
    		System.out.println("tutor profile");
    	}
    	
    	// Start the meeting documentation activity
    	else if (drawerStrings[position].equals("Document a Student Meeting")) {
    		// code
    		System.out.println("document meeting");
    	}
    	
    	// Logout
    	else if (drawerStrings[position].equals("Logout")) {
    		// Send a logout request to the server
    		AjaxRequest request = new AjaxRequest("GET", "http://mustangtutors.floccul.us/Laravel/public/users/logout/"+sharedPref.getString("user_id", ""));
            request.send();
            
    		// Delete user data from preferences
    		editor.clear().commit();
    		
    		// Update navigation drawer
    		fillNavDrawer("logged out");
    		
    		// Hide the toggle availability switch
			mMenu.findItem(R.id.mySwitch).setVisible(false);
    		
    		// Show a logout toast
    		Toast.makeText(getApplicationContext(), 
    				getString(R.string.logged_out), 
    				Toast.LENGTH_SHORT).show();
    		return;
    	}
    	
    	// Highlight the item in the drawer, then close the drawer.
    	mDrawerList.setItemChecked(position, true);
    	mDrawerLayout.closeDrawer(mDrawerList);
    }
    
    // Process data received from other activities (login)
    protected void onActivityResult (int requestCode, int resultCode, Intent data) {
    	if (requestCode == 1) {
    		String value = data.getStringExtra(LoginActivity.EXTRA_MESSAGE);
    		if (value.equals("logged in")) {
				// Write user data to the preferences file.
				editor.putString("user_id", data.getStringExtra(LoginActivity.USER_ID));
				editor.putString("name", data.getStringExtra(LoginActivity.NAME));
				editor.putString("availability", "2");
				editor.commit();
				
				// Update the navigation drawer with links for a logged in user.
    			fillNavDrawer("logged in");
    			
    			// Show the toggle availability switch and set it.
    			mMenu.findItem(R.id.mySwitch).setVisible(true);
    			mySwitch.setChecked(true);
    			
        		// Show a login toast
        		Toast.makeText(getApplicationContext(), 
        				getString(R.string.logged_in), 
        				Toast.LENGTH_SHORT).show();
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
    
    public int getAvailability(){
    	AjaxRequest request = new AjaxRequest("GET", "http://mustangtutors.floccul.us/Laravel/public/users/available/"+sharedPref.getString("user_id", ""));
    	JSONArray json;
        try {
            json = new JSONArray(request.send());
            JSONObject availability = (JSONObject) json.get(0);
            String available = availability.getString("available");
            if(available.equals("2")){
            	return 2;
            }else if(available.equals("1")){
            	return 1;
            }
        } catch (Exception e) {
        }
        
        return 0;
    }
    
    public void toggleAvailability(){
    	// Toggle the availability of the current user in the database
    	AjaxRequest request = new AjaxRequest("GET", "http://mustangtutors.floccul.us/Laravel/public/users/toggle/"+sharedPref.getString("user_id", ""));
        request.send();
        Log.d("scz","toggled");
    }
}