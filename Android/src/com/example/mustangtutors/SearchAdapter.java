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
	    super(context, resource);
	    this.context = context;
	    this.resource = resource;
	    this.tutors = tutors;
	}
	
	@Override
	public View getView(int position, View coverView, ViewGroup parent) {
	    LayoutInflater inflater = (LayoutInflater) context
	            .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
	    View rowView = inflater.inflate(resource, parent, false);

	    TextView text = (TextView) rowView.findViewById(R.id.search_item_text);
	    text.setText(tutors.get(position).getName());
	
	    return rowView;
	}
}