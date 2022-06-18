import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import secrets
import hashlib

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
    return await users_col.insert_one({
        'credentials': {
            'email': email,
            'username': username,
            'password': hashed,
            'salt': salt
        }
    })

async def validate_login(username, password):
    user_matches = await (users_col.find({'credentials.username': username})).to_list(length=10000)
    for user in user_matches:
        salt = user['credentials']['salt']
        target_pass = user['credentials']['password']
        input_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 10000).hex()
        if input_hash == target_pass:
            return True
    return False