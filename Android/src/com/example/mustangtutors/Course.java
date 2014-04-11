package com.example.mustangtutors;

public class Course {
	String mSubject;
	String mCourseNumber;
	String mCourseName;
	
	public Course (String subject, String courseNumber, String courseName) {
		mSubject = subject;
		mCourseNumber = courseNumber;
		mCourseName = courseName;
	}
	
	public String toString() {
		return mSubject + " " + mCourseNumber + ":\t" + mCourseName;
	}
}
