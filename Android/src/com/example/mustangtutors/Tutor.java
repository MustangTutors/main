package com.example.mustangtutors;

public class Tutor {
	private int id;
	private String name;
	private int numberRatings;
	private double rating;
	private int availability;
	
	public Tutor() {
		super();
		this.id = 1;
		this.name = "Story Zanetti";
		this.numberRatings = 25;
		this.rating = 3.5;
		this.availability = 2;
	}
	
	public Tutor(int id, String name, int numberRatings, double rating, int availability) {
		super();
		this.id = id;
		this.name = name;
		this.numberRatings = numberRatings;
		this.rating = rating;
		this.availability = availability;
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
		this.rating = rating;
	}
	public int getAvailability() {
		return availability;
	}
	public void setAvailability(int availability) {
		this.availability = availability;
	}
}
