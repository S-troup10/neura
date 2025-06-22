import time
from datetime import datetime, timedelta, timezone
import send_email
import supabase_storage as storage
import schedule

CLIENT_ID = '671187242058-mernc7k7i178t0u819hs63ckkbt8q4fp.apps.googleusercontent.com'
CLIENT_SECRET = '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'


def run_campaign_job(schedule_id, campaign_id):
    print(f"✅ Running campaign {campaign_id}, schedule ID: {schedule_id}")
    

    #get the campaogn details 
    campaign = storage.fetch('campaigns', {'id': campaign_id})
    print(campaign)
    # extract the elements 
    list_ids = campaign['list_id']  # could be a single ID or a list

    # Make sure it's a list
    if not isinstance(list_ids, list):
        list_ids = [list_ids]

    # Get all emails in one query
    all_emails = storage.fetch(
        table='emails',
        filters=None,
        multi_filters={'list_id': list_ids}
    )
    print(all_emails) 

        
    subject = campaign['subject']
    body = campaign['body']
    
    print(body, subject)
    
    print('campagin : ', campaign)

    res = storage.update_row_by_primary_key(
        'schedule',
        {'status': 'sent', 'id': schedule_id},
        'id'
    )
    print(res)


