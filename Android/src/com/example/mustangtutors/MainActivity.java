package com.example.mustangtutors;

import android.app.Activity;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.support.v4.app.ActionBarDrawerToggle;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;

public class MainActivity extends Activity {
    private DrawerLayout mDrawerLayout;
    private ListView mDrawerList;
    private ActionBarDrawerToggle mDrawerToggle;

    private CharSequence mDrawerTitle;
    private CharSequence mTitle;
    private String[] drawerImages;
    private int[] drawerImagesInt;
    private String[] drawerStrings;
    
    // Populate the navigation drawer.
    public void fillNavDrawer(String type) {
    	if (type.equals("logged out")) {
    		drawerImages = getResources().getStringArray(R.array.logged_out_menu_images);
        	drawerStrings = getResources().getStringArray(R.array.logged_out_menu);
    	}
    	else if (type.equals("logged in")) {
    		drawerImages = getResources().getStringArray(R.array.logged_in_menu_images);
        	drawerStrings = getResources().getStringArray(R.array.logged_in_menu);
    	}
    	// Convert the image names to resource IDs
    	drawerImagesInt = new int[drawerImages.length];
    	for (int i = 0; i < drawerImages.length; i++) {
    		drawerImagesInt[i] = getResources().getIdentifier(drawerImages[i], "drawable", getPackageName());
    	}
        // set up the drawer's list view with items and click listener
    	AdapterClass customAdapter = new AdapterClass(this, R.layout.drawer_list_item, drawerImagesInt, drawerStrings);
        mDrawerList.setAdapter(customAdapter);
        mDrawerList.setOnItemClickListener(new DrawerItemClickListener());
    }
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mTitle = mDrawerTitle = getTitle();
        mDrawerLayout = (DrawerLayout) findViewById(R.id.drawer_layout);
        mDrawerList = (ListView) findViewById(R.id.left_drawer);
        fillNavDrawer("logged out");

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
                invalidateOptionsMenu(); // creates call to onPrepareOptionsMenu()
            }

            public void onDrawerOpened(View drawerView) {
                getActionBar().setTitle(mDrawerTitle);
                invalidateOptionsMenu(); // creates call to onPrepareOptionsMenu()
            }
        };
        mDrawerLayout.setDrawerListener(mDrawerToggle);

        if (savedInstanceState == null) {
            selectItem(0);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.main, menu);
        return super.onCreateOptionsMenu(menu);
    }

    /* Called whenever we call invalidateOptionsMenu() */
    @Override
    public boolean onPrepareOptionsMenu(Menu menu) {
        // If the nav drawer is open, hide action items related to the content view
        //boolean drawerOpen = mDrawerLayout.isDrawerOpen(mDrawerList);
        //menu.findItem(R.id.action_websearch).setVisible(!drawerOpen);
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
    	
    	// Logout
    	if (drawerStrings[position].equals("Logout")) {
    		fillNavDrawer("logged out");
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
    			fillNavDrawer("logged in");
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
}