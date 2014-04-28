// From: http://developer.aiwgame.com/imageview-show-image-from-url-on-android-4-0.html

package com.example.mustangtutors;

import java.io.InputStream;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.util.Log;
import android.widget.ImageView;

public class DownloadImageTask extends AsyncTask<String, Void, Bitmap> {
    ImageView bmImage;
    Context mContext;

    public DownloadImageTask(Context mContext, ImageView bmImage) {
    	this.mContext = mContext;
        this.bmImage = bmImage;
    }

    protected Bitmap doInBackground(String... urls) {
        String urldisplay = urls[0];
        Bitmap mIcon11 = null;
        try {
            InputStream in = new java.net.URL(urldisplay).openStream();
            mIcon11 = BitmapFactory.decodeStream(in);
        } catch (Exception e) {
            Log.e("Error", e.getMessage());
            e.printStackTrace();
        }
        return mIcon11;
    }

    protected void onPostExecute(Bitmap result) {
    	if (result == null) {
    		result = BitmapFactory.decodeResource(
			        mContext.getResources(), R.drawable.tutor);
		}
        bmImage.setImageBitmap(result);
    }
}