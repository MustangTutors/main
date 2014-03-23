package com.example.mustangtutors;

import java.util.ArrayList;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
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

	    TextView name = (TextView) rowView.findViewById(R.id.search_tutor_name);
	    TextView numberRatings = (TextView) rowView.findViewById(R.id.search_tutor_number_ratings);
	    TextView availability = (TextView) rowView.findViewById(R.id.search_tutor_availability);
	    name.setText(tutors.get(position).getName());
	    numberRatings.setText("Avg of " + tutors.get(position).getNumberRatings() + " ratings:");
	    availability.setText("Available");
	
	    return rowView;
	}
}