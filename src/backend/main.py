from fastapi import FastAPI, Response, status, Request
import models
import DBHandler as dh
import uvicorn

app = FastAPI()

@app.post('/api/login/', status_code=200)
async def login(user: models.UserLogin, response: Response):
    print(f'Received {user}')
    login_response = await dh.login(user.username, user.password)
    if not login_response['success']:
        response.status_code = status.HTTP_401_UNAUTHORIZED
    else:
        return {'new-auth-token': login_response['auth-token']}

@app.post('/api/sign-up/', status_code=201)
async def signup(user: models.UserSignup, response: Response):
    print(f'Received {user}')
    username_exists = await dh.user_exists('credentials.username', user.username)
    email_exists = await dh.user_exists('credentials.email', user.email)
    
    if username_exists or email_exists:
        response.status_code = status.HTTP_409_CONFLICT
        return {
            'username-exists': username_exists,
            'email-exists': email_exists,
            'database-error': False
        }
    else:
        write_response = (await dh.create_user(user.email, user.username, user.password)).acknowledged
        if not write_response:
            response.status_code = status.HTTP_424_FAILED_DEPENDENCY
            return {
                'username-exists': username_exists,
                'email-exists': email_exists,
                'database-error': True
            }

@app.post('/api/check-token/', status_code=200)
async def check_token(user: models.UserToken, response: Response):
    db_response = await dh.validate_token(user.username, user.token)
    if not db_response:
        response.status_code = status.HTTP_401_UNAUTHORIZED

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, log_level="info")