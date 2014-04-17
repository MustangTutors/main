package com.example.mustangtutors;

import android.util.Log;

public class Hours {
	String mDay;
	String mStartTime;
	String mEndTime;
	
	public Hours(String day, String startTime, String endTime) {
		mDay = convertDay(day);
		mStartTime = convertTime(startTime);
		mEndTime = convertTime(endTime);
	}
	
	public String toString() {
		return mDay + ": \t" + mStartTime + " to " + mEndTime;
	}
	
	private String convertDay(String day) {
		switch (Integer.parseInt(day)) {
			case 1: day = "Sunday"; break;
			case 2: day = "Monday"; break;
			case 3: day = "Tuesday"; break;
			case 4: day = "Wednesday"; break;
			case 5: day = "Thursday"; break;
			case 6: day = "Friday"; break;
			case 7: day = "Saturday"; break;
			default: break;
		}
		return day;
	}
	
	private String convertTime(String militaryTime) {
		int hours24 = Integer.parseInt(militaryTime.substring(0, 2));
	    int hours = ((hours24 + 11) % 12) + 1;
	    String amPm = hours24 > 11 ? "PM" : "AM";
	    String minutes = militaryTime.substring(3, 5);
	    return hours + ":" + minutes + " " + amPm;
	}
}
