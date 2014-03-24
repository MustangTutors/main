// I built this class using help from:
// http://www.vogella.com/tutorials/AndroidNetworking/article.html
// http://stackoverflow.com/questions/9767952/how-to-add-parameters-to-httpurlconnection-using-post

package com.example.mustangtutors;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONObject;

public class AjaxRequest {
	private String requestType;
	private URL url;
	private List<NameValuePair> params;
	
	public AjaxRequest(String requestType, String url) throws MalformedURLException {
		setRequestType(requestType);
		setUrl(url);
		params = new ArrayList<NameValuePair>();
	}
	
	public JSONObject send() throws Exception {
		JSONObject output = null;
		try {
		    HttpURLConnection con = (HttpURLConnection) url.openConnection();
		    if (requestType.equals("POST")) {
		    	con.setDoOutput(true);
		    	OutputStream out = con.getOutputStream();
		    	BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(out, "UTF-8"));
		    	writer.write(getQuery(params));
		    	writer.flush();
		    	writer.close();
		    	out.close();
		    }
		    output = new JSONObject(readStream(con.getInputStream()));
		}
    	catch (Exception e) {
		  throw e;
		}
		return output;
	}
	
	public void setRequestType(String requestType) {
		requestType = requestType.toUpperCase();
		if (!requestType.equals("GET") && !requestType.equals("POST")) {
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
	
	// Returns the index of a parameter if found, else -1 otherwise.
	private int findParam(String key) {
		for (int i = 0; i < params.size(); i++) {
			if (params.get(i).getName().equals(key)) {
				return i;
			}
		}
		return -1;
	}
	
	// Add a parameter. If the parameter (same key) already existed, replace it.
	public void addParam(String key, String value) {
		int index = findParam(key);
		if (index == -1) {
			params.add(new BasicNameValuePair(key, value));
		}
		else {
			params.set(index, new BasicNameValuePair(key, value));
		}
	}
	
	// Delete a parameter with the given key.
	public void deleteParam(String key) {
		int index = findParam(key);
		if (index != -1) {
			params.remove(index);
		}
	}
	
	// Delete all the parameters.
	public void deleteAllParams() {
		params.clear();
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
	
	private String getQuery(List<NameValuePair> params) throws UnsupportedEncodingException
	{
	    StringBuilder result = new StringBuilder();
	    boolean first = true;

	    for (NameValuePair pair : params)
	    {
	        if (first)
	            first = false;
	        else
	            result.append("&");

	        result.append(URLEncoder.encode(pair.getName(), "UTF-8"));
	        result.append("=");
	        result.append(URLEncoder.encode(pair.getValue(), "UTF-8"));
	    }

	    return result.toString();
	}
}
