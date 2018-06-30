
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
declare const Pusher: any;
@Injectable()
export class PusherServiceProvider {
  channel;
  constructor(public http: HttpClient) {
  var pusher = new Pusher("8bd710fb9650c5f73b3d", { 
  cluster: 'eu',
  encrypted: true,
  });
  this.channel = pusher.subscribe('comments');
}

  public init(){
   return this.channel;
  }
}