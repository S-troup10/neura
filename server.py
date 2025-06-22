from flask import Flask, request, jsonify, render_template, session, redirect, abort
from flask_cors import CORS
import gunicorn
import supabase_storage as storage
import send_email as Email
import requests

app = Flask(__name__)
CORS(app)  # Enables CORS for all routes
app.secret_key = 'super_secret_key_123456'


import re

SUSPICIOUS_PATTERNS = [
    re.compile(r"(<script.*?>.*?</script>)", re.IGNORECASE),
    re.compile(r"(select|insert|update|delete|drop|union|--|;|exec|<|>)", re.IGNORECASE),
    re.compile(r"(on\w+\s*=)", re.IGNORECASE),  # Inline event handlers like onclick=
]

def is_suspicious(data):
    if isinstance(data, str):
        for pattern in SUSPICIOUS_PATTERNS:
            if pattern.search(data):
                return True
    elif isinstance(data, (dict, list)):
        return any(is_suspicious(v) for v in (data.values() if isinstance(data, dict) else data))
    return False

@app.before_request
def check_for_malicious_input():
  
    if is_suspicious(request.args):
        abort(400, description="Suspicious input detected in query parameters.")

   
    if request.form and is_suspicious(request.form):
        abort(400, description="Suspicious input detected in form submission.")

   
    if request.is_json:
        json_data = request.get_json(silent=True)
        if json_data and is_suspicious(json_data):
            abort(400, description="Suspicious input detected in JSON body.")

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
    #this will return the id
    res = storage.add('users', data)
    if res.get('success') == False:
        #handle invaliod sign up
        print(res)
        return jsonify({'message': 'customer was unable to be ad', 'success': False}), 200
        
        
    #send confrimation email
    #find a way to do this async
    Email.confirmationEmail(data.get('email'), data.get('firstName'))
    
    #make sure only one person is logged in
    session.pop('user', None)
    
    
    session['user'] = {
        'first_name': data.get('firstName'),
        'last_name': data.get('lastName'),
        'email': data.get('email'),
        'id': res.get('id')
        
    }
    return jsonify({'message': 'Sign-up successful',  'success': True, 'redirect': '/dashboard'}), 200



@app.route('/logout',  methods=['POST'])
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

    response , user = storage.get_user_by_email(email)
    if not response:
        return jsonify({'error': 'User not found'}), 404
    print(user)
    user.pop('password', None) 
    
    if user.get('refresh_token') is None:
        user['refresh_token'] = False
    else:
        user['refresh_token'] = True

    
    
    return jsonify(user), 200




@app.route('/login', methods=['POST'])
def login():
    data = request.json
  
    success, response = storage.validate(data)
    print(success)

    if success:
        session['user'] = {
            'first_name': response['first_name'],
            'last_name': response['last_name'],
            'email': response['email'],
            'id': response['id']
        }
        return jsonify(success=True, message="Logged in successfully")
    else:
        return jsonify(success=False, message=response)

        


@app.route('/update', methods=['POST'])
def save():
    data = request.json
    print(data)
    res = storage.update_row_by_primary_key(
        data.get('table'), data.get('data'), data.get('primary_key')
    )
    if res.get('success'):
        return jsonify(success=True, message="Data saved successfully", response=res)
    else:
        return jsonify(success=False, message="An error occurred while saving data", error=res.get('error'))

    

@app.route('/add', methods=['POST'])
def add():
    data = request.json
    # { table: _____  , data : _______  }
    res = storage.add(data.get('table'), data.get('data'))
    # retun { res : ____ , success : ____}
   
    if res.get('success') == True:
        return jsonify(success=True, message="data saved sucsessfully" , response=res, identification=res.get('id')), 200
    else:
        
        return jsonify(success=False, message="an error occured in saving the data", error=res.get('error'))



@app.route('/api/save_campaign', methods=['POST'])
def execute_sql():
    data = request.json

    campaign_data = data.get('campaign')
    schedule = data.get('schedule', {})
    
    
    inserts = schedule.get('inserts', [])
    updates = schedule.get('updates', [])
    deletes = schedule.get('deletes', [])
    
    camp_id = campaign_data.get('id')

    # Update the campaign
    res = storage.update_row_by_primary_key('campaigns', campaign_data, 'id')
    if not res.get('success'):
        return jsonify(success=False, error=res.get('error'))

    # Handle inserts
    if inserts:
        res_insert = storage.add('schedule', inserts)
        if not res_insert.get('success'):
            return jsonify(success=False, error="Insert failed: " + res_insert.get('error', ''))

    # Handle updates
    for item in updates:
        res_update = storage.update_row_by_primary_key('schedule', item, 'id')
        if not res_update.get('success'):
            return jsonify(success=False, error="Update failed: " + res_update.get('error', ''))

    # Handle deletes (bulk)
    if deletes:
        res_delete = storage.delete_multiple('schedule', deletes)
        if not res_delete.get('success'):
            return jsonify(success=False, error="Delete failed: " + res_delete.get('error', ''))
        
    # if all are successful
    
    #get the new schedule associated with the campaign
    fetch = storage.fetch('schedule', {'campaign_id': camp_id})

    if fetch is None:  # if fetch failed or returned empty
        print("No data found or fetch failed")
        return jsonify(success=False, error="fetch failed")

    return jsonify(success=True, data=fetch)



    
    
    
@app.route('/getEmails', methods=['POST'])
def get_emails():
    try:
        data = request.get_json()
        list_id = data.get('list_id')

        if list_id is None:
            return jsonify({'success': False, 'error': 'Missing list_id'}), 400

        emails = storage.fetch('list_emails', {'list_id': list_id})
        return jsonify({'success': True, 'emails': emails})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500



@app.route('/add_campaign', methods=['POST'])
def add_campaign():
    try:
        data = request.json
        data['user_id'] = session.get('user').get('id')
        res = storage.add('campaigns', data)
        
        if res.get('success') == True:
            return jsonify(success=True, message="added successfully", campaign_id=res.get('id'))
        else:
            return jsonify(success=False, message="insert failed", error=res)

    except KeyError as e:
        print(e)
        return jsonify(success=False, message=f'Missing required key: {str(e)}')
    except Exception as e:
        print(e)
        return jsonify(success=False, message=f'An unexpected error occurred: {str(e)}')

    


@app.route('/api/delete', methods=['POST'])  # or ['DELETE'] if you prefer
def delete():
    data = request.get_json()

    table = data.get('table')
    _id = data.get('id')

    res = storage.delete(table, _id)

    if res.get('success'):
        return jsonify({"success": True, "message": "Deleted successfully."})
    else:
        return jsonify({"success": False, "error": res.get('error')})

 

@app.route('/save-lists', methods=['POST'])
def save_lists():
    data = request.json

    if not data:
        return jsonify({"error": "No data received"}), 400

    to_add = data.get('to_add', [])
    to_update = data.get('to_update', [])
    to_delete = data.get('to_delete', [])
    list_id = data.get('list_id', '')
    count = data.get('count', '')

    print("To Add:", to_add)
    print("To Update:", to_update)
    print("To Delete:", to_delete)

    success = True
    errors = []

    new_id_map = {}

    for record in to_add:
        temp_id = record.get('temp')  
        if temp_id : 
            del record['temp']
        res = storage.add('list_emails', record)
        
        if not res.get('success'):
            success = False
            errors.append(f"Add failed: {res.get('error')}")
        else:
            if temp_id and temp_id.startswith('temp-'):
                new_id_map[temp_id] = res.get('id')

            
        

    # Update existing records
    for record in to_update:
        res = storage.update_row_by_primary_key('list_emails',  record,  'id')
        if not res.get('success'):
            success = False
            errors.append(f"Update failed for ID {record['id']}: {res.get('error')}")

    # Delete records by ID
    for record_id in to_delete:
        res = storage.delete('list_emails', record_id)
        if not res.get('success'):
            success = False
            errors.append(f"Delete failed for ID {record_id}: {res.get('error')}")
            
    #update count 

    res = storage.update_row_by_primary_key('lists', {'count': count, 'id':list_id}, 'id')
    
    

    if success:
        return jsonify({"status": "success", "message": "Changes saved successfully.", 'new_id_map':new_id_map}), 200
    else:
        return jsonify({"status": "partial", "message": "Some operations failed.", "errors": errors}), 207


    

    
@app.route('/all_data')
def all_data():
    user = session.get('user')
    if not user:
        return jsonify(success=False, message="User not authenticated")

    user_id = user.get('id')

    # Fetch lists and campaigns
    lists = storage.fetch('lists', {'user_id': user_id}) or []
    campaigns = storage.fetch('campaigns', {'user_id': user_id}) or []

    # Attach schedule to each campaign
    for campaign in campaigns:
        schedule = storage.fetch('schedule', {'campaign_id': campaign.get('id')}) or []
        campaign['schedule'] = schedule
    print(campaigns)
    return jsonify(success=True, lists=lists, campaigns=campaigns)




CLIENT_ID = '671187242058-mernc7k7i178t0u819hs63ckkbt8q4fp.apps.googleusercontent.com'
CLIENT_SECRET = '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'



############GOOGLE STUFF
@app.route('/auth/google')
#inital send to google auth 
def google_auth():
    scope = 'openid email https://mail.google.com/'

    redirect_uri = 'http://127.0.0.1:5000/auth/google/callback'
    client_id = CLIENT_ID
    auth_url = (
        'https://accounts.google.com/o/oauth2/v2/auth'
        f'?response_type=code&client_id={client_id}'
        f'&redirect_uri={redirect_uri}'
        f'&scope={scope}&access_type=offline&prompt=consent'
    )
    return redirect(auth_url)

#this is where google has gotten the user to sign in and thefor we can now extrat the tokens and data
@app.route('/auth/google/callback')
def google_callback():
    code = request.args.get('code')
    if not code:
        return 'Authorization failed.'

    token_url = 'https://oauth2.googleapis.com/token'
    data = {
        'code': code,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'redirect_uri': 'http://127.0.0.1:5000/auth/google/callback',
        'grant_type': 'authorization_code'
    }
    token_response = requests.post(token_url, data=data).json()

    if 'error' in token_response:
        return f"Token error: {token_response['error_description']}"

    access_token = token_response.get('access_token')
    refresh_token = token_response.get('refresh_token')

    if not access_token:
        return 'Failed to obtain access token.'

    headers = {'Authorization': f'Bearer {access_token}'}
    user_info = requests.get('https://openidconnect.googleapis.com/v1/userinfo', headers=headers).json()

    user_email = user_info.get('email')
    if not user_email:
        return 'Failed to get user email.'

    # Save refresh token and email to DB
    user_id = session.get('user', {}).get('id')
    if user_id:
        update_data = {
            'refresh_token': refresh_token,
            'send_email': user_email,
            'email_provider': 'google',
            'id': user_id
        }
        res = storage.update_row_by_primary_key('users', update_data, 'id')
        print(res)

    return redirect('/dashboard#settings')





@app.route('/disconnect_account', methods=['POST'])
def disconnect_account():
    user_id = session.get('user', {}).get('id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    # Get the user's refresh token from the DB
    user = session.get('user')
    refresh_token = user.get('refresh_token')

    # Revoke refresh token if it exists
    if refresh_token:
        
        if user.get('email_provider') == 'google':
            try:
                revoke_response = requests.post(
                    'https://oauth2.googleapis.com/revoke',
                    params={'token': refresh_token},
                    headers={'content-type': 'application/x-www-form-urlencoded'}
                )
                print('Google token revoke status:', revoke_response.status_code)
            except Exception as e:
                print('Error revoking Google refresh token:', e)



    # Clear OAuth data from DB
    update_data = {
        'refresh_token': None,
        'send_email': None,
        'email_provider': None,
        'id': user_id
    }

    try:
        res = storage.update_row_by_primary_key('users', update_data, 'id')
        return jsonify({'success': True, 'message': 'Disconnected successfully.'})
    except Exception as e:
        print('Error disconnecting account:', e)
        return jsonify({'success': False,  'error': 'Failed to disconnect account'})






#start the app

if __name__ == '__main__':
    app.run(debug=True)
