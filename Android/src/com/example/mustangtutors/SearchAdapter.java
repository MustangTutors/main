package com.example.mustangtutors;

import java.util.ArrayList;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
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
	public View getView(int position, View coverView, ViewGroup parent) {
	    LayoutInflater inflater = (LayoutInflater) context
	            .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
	    View rowView = inflater.inflate(resource, parent, false);

	    ImageView picture = (ImageView) rowView.findViewById(R.id.search_tutor_picture);
	    TextView name = (TextView) rowView.findViewById(R.id.search_tutor_name);
	    TextView numberRatings = (TextView) rowView.findViewById(R.id.search_tutor_number_ratings);
	    ImageView star1 = (ImageView) rowView.findViewById(R.id.search_tutor_star_1);
	    ImageView star2 = (ImageView) rowView.findViewById(R.id.search_tutor_star_2);
	    ImageView star3 = (ImageView) rowView.findViewById(R.id.search_tutor_star_3);
	    ImageView star4 = (ImageView) rowView.findViewById(R.id.search_tutor_star_4);
	    ImageView star5 = (ImageView) rowView.findViewById(R.id.search_tutor_star_5);
	    TextView availability = (TextView) rowView.findViewById(R.id.search_tutor_availability);
	    
	    new DownloadImageTask(picture)
        	.execute("http://mustangtutors.floccul.us/img/tutors/" + tutors.get(position).getId() + ".jpg");
	    
	    // Set name
	    name.setText(tutors.get(position).getName());
	    
	    // Set number of ratings
	    int num = tutors.get(position).getNumberRatings();
	    String numberRatingsString = "Avg of " + num;
	    if (num == 1) {
	    	numberRatingsString += " rating:";
	    }
	    else {
	    	numberRatingsString += " ratings:";
	    }
	    numberRatings.setText(numberRatingsString);
	    
	    // Set rating
	    double rating = tutors.get(position).getRating();
	    // Star 1
	    if (rating == 0) {
	    	star1.setImageResource(R.drawable.emptystar);
	    }
	    else if (rating == 0.5) {
	    	star1.setImageResource(R.drawable.halfstar);
	    }
	    else if (rating >= 1) {
	    	star1.setImageResource(R.drawable.star);
	    }
	    // Star 2
	    if (rating <= 1) {
	    	star2.setImageResource(R.drawable.emptystar);
	    }
	    else if (rating == 1.5) {
	    	star2.setImageResource(R.drawable.halfstar);
	    }
	    else if (rating >= 2) {
	    	star2.setImageResource(R.drawable.star);
	    }
	    // Star 3
	    if (rating <= 2) {
	    	star3.setImageResource(R.drawable.emptystar);
	    }
	    else if (rating == 1.5) {
	    	star3.setImageResource(R.drawable.halfstar);
	    }
	    else if (rating >= 3) {
	    	star3.setImageResource(R.drawable.star);
	    }
	    // Star 4
	    if (rating <= 3) {
	    	star4.setImageResource(R.drawable.emptystar);
	    }
	    else if (rating == 3.5) {
	    	star4.setImageResource(R.drawable.halfstar);
	    }
	    else if (rating >= 4) {
	    	star4.setImageResource(R.drawable.star);
	    }
	    // Star 5
	    if (rating <= 4) {
	    	star5.setImageResource(R.drawable.emptystar);
	    }
	    else if (rating == 4.5) {
	    	star5.setImageResource(R.drawable.halfstar);
	    }
	    else if (rating == 5) {
	    	star5.setImageResource(R.drawable.star);
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
}