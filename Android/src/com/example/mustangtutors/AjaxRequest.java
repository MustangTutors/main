// I built this class using help from:
// http://www.vogella.com/tutorials/AndroidNetworking/article.html
// http://stackoverflow.com/questions/9767952/how-to-add-parameters-to-httpurlconnection-using-post

package com.example.mustangtutors;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import org.json.JSONObject;

public class AjaxRequest {
	private String requestType;
	private URL url;
	private String parms;
	
	public AjaxRequest(String requestType, String url) throws MalformedURLException {
		setRequestType(requestType);
		setUrl(url);
	}
	
	public AjaxRequest(String requestType, String url, String parms) throws MalformedURLException {
		setRequestType(requestType);
		setUrl(url);
		setParms(parms);
	}
	
	public JSONObject send() throws Exception {
		JSONObject output = null;
		try {
		    HttpURLConnection con = (HttpURLConnection) url.openConnection();
		    output = new JSONObject(readStream(con.getInputStream()));
		}
    	catch (Exception e) {
		  throw e;
		}
		return output;
	}
	
	public void setRequestType(String requestType) {
		requestType = requestType.toUpperCase();
		if (requestType != "GET" && requestType != "POST") {
			requestType = "GET";
		}
		this.requestType = requestType;
	}
	
	public String getRequestType() {
		return this.requestType;
	}
	
	public void setUrl(String url) throws MalformedURLException {
		try {
	        this.url = new URL(url);
        } catch (MalformedURLException e) {
	        throw e;
        }
	}
	
	public URL getUrl() {
		return this.url;
	}
	
	public void setParms(String parms) {
		this.parms = parms;
	}
	
	public String getParms() {
		return this.parms;
	}
	
	private String readStream(InputStream in) {
    	String output = "";
		BufferedReader reader = null;
		try {
		    reader = new BufferedReader(new InputStreamReader(in));
		    String line = "";
		    while ((line = reader.readLine()) != null) {
		        output += line + "\n";
		    }
		}
		catch (IOException e) {
		    e.printStackTrace();
		}
		finally {
		    if (reader != null) {
		        try {
		            reader.close();
		        }
		        catch (IOException e) {
		            e.printStackTrace();
		        }
		    }
		}
	    return output;
	} 
}
