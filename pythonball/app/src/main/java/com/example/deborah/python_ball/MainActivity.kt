package com.example.deborah.python_ball

import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import com.pusher.client.Pusher
import com.pusher.client.PusherOptions
import com.pusher.pushnotifications.PushNotifications
import kotlinx.android.synthetic.main.activity_main.*
import okhttp3.MediaType
import okhttp3.OkHttpClient
import okhttp3.RequestBody
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.scalars.ScalarsConverterFactory

class MainActivity : AppCompatActivity() {

    private val apiService: ApiService by lazy {
        Retrofit.Builder()
                .baseUrl("http://10.0.2.2:5000/")
                .addConverterFactory(ScalarsConverterFactory.create())
                .client(OkHttpClient.Builder().build())
                .build().create(ApiService::class.java)
    }

    val tag = "MainActivity"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        generatePolls()
        setupPusher()
        setupBeams()
        setupClickListener()
    }


    private fun generatePolls() {
        apiService.generatePolls().enqueue(object : Callback<String> {
            override fun onFailure(call: Call<String>?, t: Throwable?) {

            }

            override fun onResponse(call: Call<String>?, response: Response<String>?) {
                val jsonObject = JSONObject(response!!.body())
                poll_title.text = jsonObject.getString("title")
                choice_1.text = jsonObject.getString("choice1")
                choice_2.text = jsonObject.getString("choice2")
                choice_3.text = jsonObject.getString("choice3")
            }
        })
    }

    private fun setupPusher() {
        val options = PusherOptions()
        options.setCluster("eu")
        val pusher = Pusher("8bd710fb9650c5f73b3d", options)
        val channel = pusher.subscribe("polls")

        channel.bind("vote") { channelName, eventName, data ->
            Log.d(tag, data)
            val jsonObject = JSONObject(data)

            runOnUiThread {
                progress_choice_1.progress = jsonObject.getInt("1")
                progress_choice_2.progress = jsonObject.getInt("2")
                progress_choice_3.progress = jsonObject.getInt("3")
            }
        }

        pusher.connect()
    }


    private fun setupBeams() {
        PushNotifications.start(applicationContext, "53cb58ec-3f4d-405a-83c3-d9b8c3901e81")
        PushNotifications.subscribe("polls-update")
    }

    private fun setupClickListener() {
        vote.setOnClickListener {
            val checkedButton = radio_group.checkedRadioButtonId
            if (checkedButton == -1) {
                Toast.makeText(this, "Please select an option", Toast.LENGTH_SHORT).show()
            } else {
                Log.d(tag, checkedButton.toString())
                val selectedId = when (checkedButton) {
                    R.id.choice_1 -> 1
                    R.id.choice_2 -> 2
                    R.id.choice_3 -> 3
                    else -> -1
                }

                val jsonObject = JSONObject()
                jsonObject.put("option", selectedId)

                val body = RequestBody.create(MediaType.parse("application/json"), jsonObject.toString())

                apiService.updatePolls(body).enqueue(object : Callback<String> {
                    override fun onFailure(call: Call<String>?, t: Throwable?) {
                        Log.d(tag, t?.localizedMessage)
                    }

                    override fun onResponse(call: Call<String>?, response: Response<String>?) {
                        Log.d(tag, response?.body())
                    }
                })
            }
        }
    }
}