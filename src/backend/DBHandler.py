import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import secrets
import hashlib
import datetime

load_dotenv()

mongo_client = AsyncIOMotorClient(os.getenv('MONGO_KEY'))
db = mongo_client['web_data']
users_col = db['users']

async def user_exists(field: str, value: str) -> bool:
    '''
    Checks if there is a user document with a matching `field: value` pair.
    '''
    result = await users_col.find_one({field: value})
    return result != None

async def create_user(email: str, username: str, password: str):
    '''
    Creates a new user in the database.
    '''
    salt = secrets.token_hex(32)
    hashed = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 10000).hex()
    auth_token = secrets.token_urlsafe(32)
    return await users_col.insert_one({
        'credentials': {
            'email': email,
            'username': username,
            'password': hashed,
            'salt': salt,
            'auth-token': auth_token,
            'expiry': None
        }
    })

async def login(username: str, password: str) -> dict:
    '''
    Logs the user in if the password is correct.
    Refreshes the auth token and sets an expiration date for it.
    '''
    user_matches = await (users_col.find({'credentials.username': username})).to_list(length=10000)
    for user in user_matches:
        salt = user['credentials']['salt']
        target_pass = user['credentials']['password']
        input_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 10000).hex()
        if input_hash == target_pass:
            auth_token = secrets.token_urlsafe(32)
            await users_col.update_one({'credentials.username': username}, {'$set': {
                'credentials.auth-token': auth_token,
                'credentials.expiry': datetime.datetime.utcnow() + datetime.timedelta(days=30)
            }})
            return {'success': True, 'auth-token': auth_token}

    return {'success': False, 'auth-token': None}

async def validate_token(username: str, token: str) -> bool:
    '''
    Checks if the user's cookie auth token is valid.
    If the auth token doesn't match or has expired, the function will return `False`.
    '''
    user_data = await users_col.find_one(
        {'credentials.username': username},
        {
            'credentials.auth-token': 1,
            'credentials.expiry': 1
        }
    )

    db_token = user_data['credentials']['auth-token']
    db_expiry = user_data['credentials']['expiry']
    print(db_token, db_expiry)
    if token != db_token or datetime.datetime.utcnow() > db_expiry:
        return False
    return True
    

'''
1. user logs in (post request is sent)
2. backend creates auth token and expiration date and sends auth token as response body
3. frontend saves auth token in a cookie

4. auth token is always checked against the database

5. user logs out (post request is sent)
6. backend changes the auth token (no expiration date is set yet)
'''