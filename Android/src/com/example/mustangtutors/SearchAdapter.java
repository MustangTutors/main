package com.example.mustangtutors;

import java.util.ArrayList;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.RatingBar;
import android.widget.TextView;

public class SearchAdapter extends ArrayAdapter<Tutor> {
	private Context context;
	private int resource;
	private ArrayList<Tutor> tutors;
	
	public SearchAdapter(Context context, int resource, ArrayList<Tutor> tutors) {
	    super(context, resource, tutors);
	    this.context = context;
	    this.resource = resource;
	    this.tutors = tutors;
	}
	
	@Override
	public View getView(int position, View convertView, ViewGroup parent) {
	    LayoutInflater inflater = (LayoutInflater) context
	            .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
	    View rowView;
	    if (convertView == null) {
	    	rowView = inflater.inflate(resource, parent, false);
	    }
	    else {
	    	rowView = convertView;
	    }

	    ImageView picture = (ImageView) rowView.findViewById(R.id.search_tutor_picture);
	    TextView name = (TextView) rowView.findViewById(R.id.search_tutor_name);
	    RatingBar stars = (RatingBar) rowView.findViewById(R.id.search_tutor_rating);
	    TextView availability = (TextView) rowView.findViewById(R.id.search_tutor_availability);
	    
	    new DownloadImageTask(picture)
        	.execute("http://mustangtutors.floccul.us/img/tutors/" + tutors.get(position).getId() + ".jpg");
	    
	    // Set name
	    name.setText(tutors.get(position).getName());
	    
	    // Set rating
	    float rating = (float) tutors.get(position).getRating();
	    if (rating < 1) {
	    	stars.setVisibility(View.GONE);
	    }
	    else {
		    stars.setMax(5);
		    stars.setStepSize(0.5f);
		    stars.setRating(rating);
		    stars.setVisibility(View.VISIBLE);
	    }
	    
	    // Set availability
	    switch (tutors.get(position).getAvailability()) {
	    	case 2:  availability.setText("Available");
	    			 availability.setBackgroundResource(R.drawable.border_available);
					 break;
	    	case 1:  availability.setText("Busy");
			 		 availability.setBackgroundResource(R.drawable.border_busy);
					 break;
	    	default: availability.setText("Unavailable");
	    			 availability.setBackgroundResource(R.drawable.border_unavailable);
	    			 break;
	    }
	
	    return rowView;
	}
	
	@Override
	public long getItemId(int position) {
		return tutors.get(position).getId();
	}
}