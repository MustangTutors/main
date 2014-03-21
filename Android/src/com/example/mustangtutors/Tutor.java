package com.example.mustangtutors;

public class Tutor {
	private int id;
	private String name;
	private double rating;
	private int availability;
	
	public Tutor() {
		super();
		this.id = 0;
		this.name = "Unknown";
		this.rating = 0;
		this.availability = 0;
	}
	
	public Tutor(int id, String name, double rating, int availability) {
		super();
		this.id = id;
		this.name = name;
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
