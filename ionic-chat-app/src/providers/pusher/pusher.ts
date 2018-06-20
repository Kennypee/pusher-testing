
import { Injectable } from '@angular/core';
import Pusher from 'pusher-js';

@Injectable()
export class PusherProvider {
  constructor() {
    var pusher = new Pusher('8bd710fb9650c5f73b3d', {
      cluster: 'eu',
      encrypted: true,
    });
    this.channel = pusher.subscribe('chat');
  }
  channel;
  
  public init() {
    return this.channel;
  }
}