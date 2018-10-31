
    import React, { Component } from 'react'
    import '../App.css';
    import Chatkit from '@pusher/chatkit';
    import Message from './Message';
    import TypingIndicator from '..//components/TypingIndicator';
    class Chat extends Component {  
        constructor(props){
              super(props);
              this.state ={
                messages:[],
                currentRoom: {},
                currentUser: {},
                typingUsers: [],
                chatInput: ''
              }        
          
            this.sendMessage = this.sendMessage.bind(this);
            this._handleKeyPress = this._handleKeyPress.bind(this);
            this.sendTypingEvent = this.sendTypingEvent.bind(this);
            }      
    // update the input field when the user types something
      
        sendMessage() {
                 if(this.state.chatInput){
                    this.state.currentUser.sendMessage({
                        text: this.state.chatInput,
                        roomId: this.state.currentRoom.id,
                      })
                    }     
                    this.setState({ chatInput: ''})
                 }
                 
  sendTypingEvent(event) {
    this.state.currentUser
      .isTypingIn({ roomId: this.state.currentRoom.id })
      .catch(error => console.error('error', error))
      this.setState({
        chatInput: event.target.value
    });
  }       
        _handleKeyPress(e){
                            if (e.key === 'Enter') {
                                this.sendMessage();
                            }
                        }      
        componentDidMount() {
              const chatManager = new Chatkit.ChatManager({
                      instanceLocator: 'v1:us1:820bb38b-3ede-42e9-8a42-4dd950d117bb',
                      userId: this.props.currentUsername,
                      tokenProvider: new Chatkit.TokenProvider({
                        url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/820bb38b-3ede-42e9-8a42-4dd950d117bb/token',
                      }),
                    })
                    chatManager
                    .connect()
                    .then(currentUser => {
                      this.setState({ currentUser })
                      return currentUser.subscribeToRoom({
                        roomId: '18978756',
                        messageLimit: 100,
                        hooks: {
                          onNewMessage: message => {
                            let newmessage = this.state.messages;           
                            newmessage.push(<Message 
                                                        key={ 
                                                            this.state.messages.length 
                                                        } 
                                                        senderId={ 
                                                            message.senderId 
                                                        } 
                                                        text={ message.text 
                                                        }/>)         
                            this.setState({messages: newmessage})
                          },

onUserStartedTyping: user => {
    this.setState({
      typingUsers: [...this.state.typingUsers, user.name],
    })
  },
onUserStoppedTyping: user => {
    this.setState({
      typingUsers: this.state.typingUsers.filter(
        username => username !== user.name
      ),
    })
  },

                        },
                      })
                    })      
                    .then(currentRoom => {
                      this.setState({ currentRoom })
                     })
                    .catch(error => console.error('error', error))
            }       
            render() {
                        return ( 
                            <div id="center">
                                <div id="chat-output">
                                { this.state.messages }     
                                </div>                           
                                <input id="chat-input"
                                    type="text"
                                    placeholder='Type message...'
                                    name=""
                                    value={ this.state.chatInput } 
                                    onChange={ this.sendTypingEvent } 
                                    onKeyPress={ this._handleKeyPress }/>                 
                                <div id="btndiv">
                                <input id="button" type="button"
                                    onClick={ this.sendMessage } value="Send Chat" />
                                    <TypingIndicator typingUsers={this.state.typingUsers} />
                                </div>                           
                            </div>
                        );
                    }      
    }
    export default Chat
