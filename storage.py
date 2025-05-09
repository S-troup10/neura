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
        
        # WITH THGIS im going to need to create a new table to house email lists and email send times
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS campaigns (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                subject TEXT,
                body TEXT,
                name TEXT, 
                dates TEXT,
                list_id TEXT,
                paused BOOLEAN DEFAULT 0,
                email TEXT NOT NULL,
                app_password TEXT NOT NULL,
                
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS lists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT null,
            name TEXT NOT NULL,
            description TEXT,
            count INT,
            tag TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        );
        """)
        
        cursor.execute("""
              CREATE TABLE IF NOT EXISTS list_emails (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                list_id INTEGER NOT NULL,
                email TEXT NOT NULL,
                name TEXT,
                
                tag TEXT,
                company TEXT,
                added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                
                FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE
            );         
                       

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

def add(table, record):
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            sql, values = insert_sql(table, record)
            cursor.execute(sql, values)
            identifier = cursor.lastrowid
            conn.commit()
            return {'id' : identifier, 'success': True}
        
        
    except Exception as e:
        print(e)
        return {'error' : str(e), 'success': False}


def delete(table, record_id):
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            sql = f"DELETE FROM {table} WHERE id = ?"
            cursor.execute(sql, (record_id,))
            conn.commit()
            
            if cursor.rowcount == 0:
                return {'success': False, 'error': 'Record not found'}
            
            return {'success': True}
    
    except Exception as e:
        print(e)
        return {'error': str(e), 'success': False}


    




def fetch(table, conditions=None):
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            query = f"SELECT * FROM {table}"
            params = []

            if conditions:
                clauses = []
                for key, value in conditions.items():
                    clauses.append(f"{key} = ?")
                    params.append(value)
                query += " WHERE " + " AND ".join(clauses)

            cursor.execute(query, params)
            rows = cursor.fetchall()

            
            results = [dict(row) for row in rows]

            return results

    except Exception as e:
        print(f"Error fetching from {table}: {e}")
        return []

            
            

def insert_sql(table, record):
    columns = ", ".join(record.keys())
    placeholders = ", ".join(["?"] * len(record))
    sql = f"INSERT INTO {table} ({columns}) VALUES ({placeholders})"
    return sql, list(record.values())

    
def update_row_by_primary_key(table, data, primary_key):
    """
    Update one row in the table where primary_key = data[primary_key].

    Args:
   
        table: Table name (string)
        data: Dict of fields to update (must include primary_key field)
        primary_key: The column name of the primary key (string)

    Returns:
        Number of rows updated
    """
    
    try:
        with get_db_connection() as conn:
            if primary_key not in data:
                raise ValueError(f"Missing primary key '{primary_key}' in data.")

            record = data.copy()
            key_value = record.pop(primary_key)  # Remove PK from fields to update

            set_clause = ", ".join([f"{col} = ?" for col in record.keys()])
            sql = f"UPDATE {table} SET {set_clause} WHERE {primary_key} = ?"
            params = list(record.values()) + [key_value]

            cursor = conn.cursor()
            cursor.execute(sql, params)
            conn.commit()
            return {'success':True}
    except Exception as e:
        print(e)
        return {'error': str(e), 'success':False}

    

    
def increment_column_by_primary_key(increment, key_value):
    """
    Increment a numeric column for one row in the table where primary_key = key_value.

    Args:
        table: Table name (string)
        column: Column name to increment (string)
        increment: Integer value to add
        primary_key: The column name of the primary key (string)
        key_value: The value of the primary key for the row to update

    Returns:
        Dict indicating success or error
    """
    try:
        with get_db_connection() as conn:
            sql = f"""
                UPDATE {'lists'}
                SET count = count + ?
                WHERE id = ?
            """
            cursor = conn.cursor()
            cursor.execute(sql, (increment, key_value))
            conn.commit()
            return {'success': True}
    except Exception as e:
        print(e)
        return {'error': str(e), 'success': False}

    


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
            user_id = cursor.lastrowid
            conn.commit()
            return user_id
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
