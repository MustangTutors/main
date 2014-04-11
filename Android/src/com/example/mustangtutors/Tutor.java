package com.example.mustangtutors;

import java.util.ArrayList;

public class Tutor {
	private int id;
	private String name;
	private int numberRatings;
	private double rating;
	private int availability;
	private ArrayList<Course> courses;
	private ArrayList<Hours> hours;
	
	public Tutor() {
		this.id = 1;
		this.name = "Story Zanetti";
		this.numberRatings = 25;
		this.rating = 3.5;
		this.availability = 2;
		this.courses = new ArrayList<Course>();
		this.hours = new ArrayList<Hours>();
	}
	
	public Tutor(int id, String name, int numberRatings, double rating, int availability) {
		if (rating < 0) {
			rating = 0;
		}
		else if (rating > 5) {
			rating = 5;
		}

		if (availability != 0 && availability != 1 && availability != 2) {
			availability = 0;
		}
		
		this.id = id;
		this.name = name;
		this.numberRatings = numberRatings;
		this.rating = roundTo(rating, 0.5);
		this.availability = availability;
		this.courses = new ArrayList<Course>();
		this.hours = new ArrayList<Hours>();
	}
	
	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public int getNumberRatings() {
		return numberRatings;
	}
	
	public void setNumberRatings(int numberRatings) {
		this.numberRatings = numberRatings;
	}
	
	public double getRating() {
		return rating;
	}
	
	public void setRating(double rating) {
		if (rating < 0) {
			rating = 0;
		}
		else if (rating > 5) {
			rating = 5;
		}
		this.rating = roundTo(rating, 0.5);
	}
	
	public int getAvailability() {
		return availability;
	}
	
	public void setAvailability(int availability) {
		if (availability != 0 && availability != 1 && availability != 2) {
			availability = 0;
		}
		this.availability = availability;
	}
	
	public void addCourse(String subject, String courseNumber, String courseName) {
		this.courses.add(new Course(subject, courseNumber, courseName));
	}
	
	public ArrayList<Course> getCourses() {
		return this.courses;
	}
	
	public void addHours(String day, String startTime, String endTime) {
		this.hours.add(new Hours(day, startTime, endTime));
	}
	
	public ArrayList<Hours> getHours() {
		return this.hours;
	}
	
	private static double roundTo(double v, double r) {
		return Math.round(v / r) * r;
	}
}
