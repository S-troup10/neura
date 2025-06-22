
from supabase import create_client, Client

# Replace with your real values
SUPABASE_URL = "https://ksqoiphgapivpmijmvjh.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzcW9pcGhnYXBpdnBtaWptdmpoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTcyMjA0OCwiZXhwIjoyMDYxMjk4MDQ4fQ.EQOS8--wmkSw78ushX4x3H99dRtY3XWAWAcOSTk2Naw"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)





def add(table, data):
    try:
        response = supabase.table(table).insert(data).execute()
        inserted_id = response.data[0]['id'] if response.data else None
        return {'success': True, 'id': inserted_id}
    except Exception as e:
        return {'success': False, 'error': str(e)}


def delete_multiple(table, id_list):
    """
    Deletes multiple rows by ID from a Supabase table.

    Args:
        table (str): Table name.
        id_list (list): List of record IDs to delete.

    Returns:
        dict: Success or error message.
    """
    try:
        response = supabase.table(table).delete().in_("id", id_list).execute()
        return {'success': True, 'response': response}
    except Exception as e:
        return {'success': False, 'error': str(e)}



def delete(table, record_id):
    """
    Deletes a row from the specified Supabase table by ID.

    Args:
        table (str): Table name.
        record_id (int or str): ID of the record to delete.

    Returns:
        dict: Success or error message.
    """
    try:
        response = supabase.table(table).delete().eq("id", record_id).execute()

        # If the data is empty, the record may not exist
        if not response.data:
            return {'success': False, 'error': 'Record not found'}

        return {'success': True}

    except Exception as e:
        print(f"Delete error on table '{table}': {e}")
        return {'error': str(e), 'success': False}





    




def fetch(table, filters, multi_filters=None):
    try:
        query = supabase.table(table).select('*')

        if filters:
            for key, value in filters.items():
                query = query.eq(key, value)

        if multi_filters:
            for key, value_list in multi_filters.items():
                query = query.in_(key, value_list)

        response = query.execute()
        return response.data

    except Exception as e:
        print('Error in fetch:', e)
        return None





        
            
            



def update_row_by_primary_key(table, data, primary_key):
    """
    Update one row in the table where primary_key = data[primary_key].

    Args:
        table (str): Table name
        data (dict): Fields to update (must include the primary key)
        primary_key (str): The name of the primary key column

    Returns:
        dict: Success status or error message
    """
    try:
        if primary_key not in data:
            raise ValueError(f"Missing primary key '{primary_key}' in data.")

        record = data.copy()
        key_value = record.pop(primary_key)

        response = supabase.table(table).update(record).eq(primary_key, key_value).execute()

        # Check if update affected any records
        if not response.data:
            return {'error': 'Record not found or nothing updated.', 'success': False}

        return {'success': True, 'data': response.data}

    except Exception as e:
        return {'error': str(e), 'success': False}





def bulk_update_by_field(table, filter_field, filter_values, update_data):
    """
    Perform a bulk update on a table where filter_field is in filter_values.

    Args:
        table (str): Table name.
        filter_field (str): Column to filter by (e.g., 'campaign_id').
        filter_values (list): List of values to match.
        update_data (dict): Fields and values to update.

    Returns:
        dict: Success status and response data or error message.
    """
    try:
        response = (
            supabase
            .table(table)
            .update(update_data)
            .in_(filter_field, filter_values)
            .execute()
        )

        return {'success': True, 'data': response.data}

    except Exception as e:
        return {'success': False, 'error': str(e)}

    
def upsert(table: str, data):
    """
    Performs a bulk upsert into the specified table using Supabase.

    Args:
        table (str): Table name as a string.
        data (List[Dict]): List of dictionaries representing rows to insert/update.

    Returns:
        dict: { success: bool, data: list (on success), error: str (on failure) }
    """
    try:
        if not data:
            raise ValueError("Data list is empty")

        response = supabase.table(table).upsert(data).execute()
        print('supabase response : ', response)
        # If response.data is None or empty, treat as failure
        if response:
            return {'success': True, 'data': response.data}
            
        return {'error': 'No data returned from upsert', 'success': False}


    except Exception as e:
        return {'error': str(e), 'success': False}

    

# Initialize the database

def get_user_by_email(email):
    try:
        response = supabase.table("users").select("*").eq("email", email).limit(1).execute()
        print('server response', response)


        if not response.data:
            return False, "No user found with that email"

        return True, response.data[0]

    except Exception as e:
        return False, f"Exception occurred: {e}"






def validate(data):
    print(f'incoming data: {data}')
    
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return False, 'Email or password not received'

    success, user_or_error = get_user_by_email(email)

    if not success:
        return False, user_or_error# user_or_error is the error string

    user = user_or_error

    if user.get('password') == password:
        user.pop('password', None)
        return True, user
    else:
        return False, 'Credentials invalid'


from datetime import datetime

def query_for_times(up_to: datetime):
    try:
        # Perform the query: get all "pending" entries scheduled up to this time
        response = supabase.table("schedule")\
            .select("*")\
            .lte("scheduled_time", up_to.isoformat())\
            .eq("status", False)\
            .execute()

        if not response.data:
            print(f"[{up_to}] No pending schedules found up to this point.")
            return []

        print(f"[{up_to}] Found {len(response.data)} pending schedule(s).")
        return response.data

    except Exception as e:
        print(f"Error querying schedule table at {up_to}: {e}")
        return []


