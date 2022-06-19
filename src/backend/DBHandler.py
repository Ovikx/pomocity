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

async def user_exists(email):
    result = await users_col.find_one({'credentials.email': email})
    return result != None

async def create_user(email, username, password):
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
            'expiration-date': None
        }
    })

async def login(username, password):
    user_matches = await (users_col.find({'credentials.username': username})).to_list(length=10000)
    for user in user_matches:
        salt = user['credentials']['salt']
        target_pass = user['credentials']['password']
        input_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 10000).hex()
        if input_hash == target_pass:
            auth_token = secrets.token_urlsafe(32)
            await users_col.update_one({'credentials.username': username}, {'$set': {
                'credentials.auth-token': auth_token,
                'credentials.expiration-date': datetime.datetime.utcnow() + datetime.timedelta(days=30)
            }})
            return {'success': True, 'auth-token': auth_token}

    return {'success': False, 'auth-token': None}

'''
1. user logs in (post request is sent)
2. backend creates auth token and expiration date and sends auth token as response body
3. frontend saves auth token in a cookie

4. auth token is always checked against the database

5. user logs out (post request is sent)
6. backend changes the auth token (no expiration date is set yet)
'''