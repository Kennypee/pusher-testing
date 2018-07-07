
from flask import Flask, jsonify, request, json
from pusher import Pusher
from pusher_push_notifications import PushNotifications

app = Flask(__name__)
pn_client = PushNotifications(
    instance_id='53cb58ec-3f4d-405a-83c3-d9b8c3901e81',
    secret_key='922963DDC018B3BB3519C240C8A2FCD',
)

pusher = Pusher(app_id=u'519555', key=u'8bd710fb9650c5f73b3d', secret=u'81bebaedfe87d6e31e0e', cluster=u'eu')

# Variables to hold scores of polls
choice1 = 0
choice2 = 0
choice3 = 0

# Route to send poll question
@app.route('/generate')
def send_poll_details():
    return jsonify({'title':'Who will win the 2018 World Cup','choice1': 'Germany', 'choice2':'Brazil', 'choice3':'Spain'})
    
@app.route('/update', methods=['POST'])
def update_poll():
    global choice1, choice2, choice3
    
    req_data = request.get_json()
    
    user_choice = req_data['option']
    
    if user_choice == 1:
        choice1 += 1
    elif user_choice == 2:
        choice2 += 1
    elif user_choice == 3:
        choice3 += 1
    else:
        print("User choose a wrong option")
    
    total = 0.0
    total = float(choice1 + choice2 + choice3)
    
    choice1_percent = (choice1/total) * 100
    choice2_percent = (choice2/total) * 100
    choice3_percent = (choice3/total) * 100
    
    pn_client.publish(
    interests=['polls-update'],
    publish_body={
        'fcm': {
            'notification': {
                'title': 'Polls update',
                'body': 'There are currently ' + str(int(round(total))) + 'vote(s) in the polls. Have you casted your vote?',
            },
        },
    },
    )
    
    pusher.trigger(u'polls', u'vote', {u'1': choice1_percent, '2':choice2_percent, '3':choice3_percent})
    
    return 'success', 200