package com.example.mustangtutors;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

public class AdapterClass extends ArrayAdapter<String> {
	private Context context;
	private int resource;
	private int[] icons;
	private String[] objects;
	
	public AdapterClass(Context context, int resource, int[] icons, String[] objects) {
	    super(context, resource, objects);
	    this.context = context;
	    this.resource = resource;
	    this.icons = icons;
	    this.objects = objects;
	}
	
	@Override
	public View getView(int position, View coverView, ViewGroup parent) {
	    LayoutInflater inflater = (LayoutInflater) context
	            .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
	    View rowView = inflater.inflate(resource, parent, false);

	    TextView text = (TextView)rowView.findViewById(R.id.drawer_item_text);
	    text.setText(objects[position]);
	    text.setCompoundDrawablesWithIntrinsicBounds(icons[position], 0, 0, 0);
	
	    return rowView;
	}
}