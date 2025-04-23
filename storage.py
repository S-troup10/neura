import sqlite3
import bcrypt

STORE_NAME = 'storage.db'

def get_db_connection():
    conn = sqlite3.connect(STORE_NAME)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        """)
        
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS campaigns (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                name TEXT, 
                email_incriments INT,
                start_date DATE,
                paused BOOLEAN DEFAULT 0,
                email TEXT NOT NULL,
                app_password TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        """)



        conn.commit()

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')



def get_user_by_email(email):
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
            user = cursor.fetchone()
            if not user:
                return None
            user = dict(user)
            return user
    except sqlite3.Error as e:
        print(e)
        return None




         
def add_campaign(record):
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            user_id = get_user_by_email(record.get('user_email')).get('id')

            # Insert customer campaign record
            cursor.execute("""
                INSERT INTO campaigns (
                    user_id, name, email_incriments, start_date,
                    paused, email, app_password
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                user_id,
                record.get('name'),
                record.get('email_incriments', 0), #days
                record.get('start_date'),  # Should be in 'YYYY-MM-DD' format
                record.get('paused', 0),
                record.get('email'),
                record.get('app_password')
            ))

            conn.commit()
            return True

    except sqlite3.IntegrityError as e:
        print("IntegrityError: Possibly duplicate email. Details:", e)
        return e
    except Exception as e:
        print("Error inserting customer campaign:", e)
        return e


def fetch_campaigns(user_id):
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            cursor.execute('SELECT * FROM campaigns WHERE user_id = ?', (user_id,))
            rows = cursor.fetchall()

            if not rows:
                return []

            # Get column names from cursor.description
            columns = [column[0] for column in cursor.description]

            # Convert rows to a list of dictionaries
            campaigns = []
            for row in rows:
                campaign = {columns[i]: row[i] for i in range(len(columns))}
                campaigns.append(campaign)

            return campaigns

    except sqlite3.Error as e:
        print("Error fetching campaigns:", e)
        return []

    

def add_user(record):
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT INTO users (first_name, last_name, email, password) 
                VALUES (?, ?, ?, ?)
            """, (record["firstName"], record["lastName"], record["email"], record['password']))
            conn.commit()
            return True
    except sqlite3.IntegrityError:
        print("Error: Email already exists.")
        return False

# Initialize the database

#data comes in as json dictonary
def validate(data):
    print(f'incoming data: {data}')
    email = data['email']
    password = data['password']
    

    user = get_user_by_email(email)
    if not user:
        return False
    if user['password'] == password:
        user.pop('password')
        return user




    
    
init_db()
