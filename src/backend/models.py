from typing import Optional
from pydantic import BaseModel

class UserLogin(BaseModel):
    username: str
    password: str

class UserSignup(BaseModel):
    email: str
    username: str
    password: str