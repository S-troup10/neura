from flask import Flask, request, jsonify, render_template, session, redirect
from flask_cors import CORS
import subprocess
import storage
import send_email as Email
import gunicorn

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
    #this will return the id
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
        'email': data.get('email'),
        'id': res
        
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
            'email' : response['email'],
            'id' : response['id']
            
           
        }
        return jsonify(success=True, message="Logged in successfully")
    else:
        return jsonify(success=False, message="Invalid credentials")
        


@app.route('/update', methods=['POST'])
def save():
    data = request.json
    # { table: _____  , data : _______  }
    res = storage.update_row_by_primary_key(data.get('table'), data.get('data'), data.get('primary_key'))
    # retun { res : ____ , success : ____}
    print(res)
    if res.get('success') == True:
        return jsonify(success=True, message="data saved sucsessfully" , response=res)
    else:
        
        return jsonify(success=False, message="an error occured in saving the data", error=res.get('error'))
    

@app.route('/add', methods=['POST'])
def add():
    data = request.json
    # { table: _____  , data : _______  }
    res = storage.add(data.get('table'), data.get('data'))
    # retun { res : ____ , success : ____}
    print(res)
    if res.get('success') == True:
        return jsonify(success=True, message="data saved sucsessfully" , response=res, identification=res.get('id')), 200
    else:
        
        return jsonify(success=False, message="an error occured in saving the data", error=res.get('error'))



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
    print(session)
    data = request.json

    data['user_id'] = session.get('user').get('id')
    print(data)
    res = storage.add('campaigns', data)
    if res.get('success') == True:
        return jsonify(success=True, message="added successfully" , campaign_id=res.get('id'))
    else:
        
        return jsonify(success=False, message="insert failed", error=res)
    


from flask import request, jsonify

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
        temp_id = record.get('temp')  # e.g., 'temp-123'
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
def allData():
    #start with lists headers
    res = storage.fetch('lists', {'user_id': session.get('user').get('id')})
    if res:
        return jsonify(success=True, lists=res)
    else:
        
        return jsonify(success=False, message="insert failed", error=res)
    

@app.route('/campaigns')
def populate_campaigns():
    user_id = storage.get_user_by_email(session.get('user').get('email')).get('id')
    data = storage.fetch_campaigns(user_id)
    print(data)
    return jsonify(success=True, data=data)


if __name__ == '__main__':
    app.run(debug=True)
