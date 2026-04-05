from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str

class PatientCreate(BaseModel):
    name: str
    disease: str