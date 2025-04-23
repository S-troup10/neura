from flask import Flask, request, jsonify, render_template, session, redirect
from flask_cors import CORS
import subprocess
import storage
import send_email as Email

app = Flask(__name__)
CORS(app)  # Enables CORS for all routes
app.secret_key = 'super_secret_key_123456'





@app.route('/dashboard')
def dashboard():
    if 'user' in session:
        print("User accessing dashboard:", session.get('user'))
        return render_template('dashboard.html')
    return redirect('/')

@app.route('/')
def landingPage():
    return render_template('index.html')

#save incoming sign up
@app.route('/sign_up', methods=['POST'])
def sign_up():
    data = request.json
    print(data)
    res = storage.add_user(data)
    if res == False:
        #handle invaliod sign up
        print(res)
        return jsonify({'message': 'customer was unable to be ad', 'success': False, 'redirect': '/dashboard'}), 200
        
        
    #send confrimation email
    #find a way to do this async
    #Email.confirmationEmail(data.get('email'), data.get('firstName'))
    
    #make sure only one person is logged in
    session.pop('user', None)
    
    
    session['user'] = {
        'first_name': data.get('firstName'),
        'last_name': data.get('lastName'),
        'email': data.get('email')
        
    }
    return jsonify({'message': 'Sign-up successful',  'success': True, 'redirect': '/dashboard'}), 200



@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect('/')




#return names , photo, and other stuff for the page to render
@app.route('/session_user')
def session_user():
    session_user = session.get('user', {})
    email = session_user.get('email')

    if not email:
        return jsonify({'error': 'No user in session'}), 401

    user = storage.get_user_by_email(email)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    user.pop('password', None) 
    return jsonify(user), 200




@app.route('/login', methods=['POST'])
def login():
    data = request.json
    print(data)
    response = storage.validate(data)
    if response:
        session['user'] = {
            'first_name' : response['first_name'],
            'last_name' : response['last_name'],
            'email' : response['email']
            
           
        }
        return jsonify(success=True, message="Logged in successfully")
    else:
        return jsonify(success=False, message="Invalid credentials")
        
    
    
    
@app.route('/add_campaign', methods=['POST'])
def add_campaign(): 
    print(session)
    data = request.json

    data['user_email'] = session.get('user').get('email')
    print(data)
    res = storage.add_campaign(data)
    if res == True:
        return jsonify(success=True, message="Logged in successfully")
    else:
        
        return jsonify(success=False, message="Invalid credentials", error=res)
    

@app.route('/campaigns')
def populate_campaigns():
    user_id = storage.get_user_by_email(session.get('user').get('email')).get('id')
    data = storage.fetch_campaigns(user_id)
    print(data)
    return jsonify(success=True, data=data)


if __name__ == '__main__':
    app.run(debug=True)
