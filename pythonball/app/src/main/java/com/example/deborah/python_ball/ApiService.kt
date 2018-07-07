package com.example.deborah.python_ball


import okhttp3.RequestBody
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface ApiService {

    @GET("/generate")
    fun generatePolls(): Call<String>

    @POST("/update")
    fun updatePolls(@Body  body: RequestBody):Call<String>

}
