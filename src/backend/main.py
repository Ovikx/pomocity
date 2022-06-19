from fastapi import FastAPI, Response, status, Request
import models
import DBHandler as dh

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
    user_exists = await dh.user_exists(user.email)
    
    if not user_exists:
        write_response = (await dh.create_user(user.email, user.username, user.password)).acknowledged
        if not write_response:
            response.status_code = status.HTTP_424_FAILED_DEPENDENCY
    else:
        response.status_code = status.HTTP_409_CONFLICT