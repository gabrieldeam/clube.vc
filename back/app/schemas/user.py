from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
import re

def validate_password(value: str) -> str:
    errors = []
    if len(value) < 8:
        errors.append("A senha deve ter no mínimo 8 caracteres.")
    if not any(char.islower() for char in value):
        errors.append("A senha deve conter pelo menos uma letra minúscula.")
    if not any(char.isupper() for char in value):
        errors.append("A senha deve conter pelo menos uma letra maiúscula.")
    if not any(char in "!@#$%^&*()-_=+[]{};:'\",.<>?/\\|" for char in value):
        errors.append("A senha deve conter pelo menos um caractere especial.")
    if " " in value:
        errors.append("A senha não pode conter espaços.")

    if errors:
        raise ValueError(" ".join(errors))
    return value

class UserCreate(BaseModel):
    id: Optional[str] = None
    name: str = Field(..., min_length=3, max_length=50, description="O nome deve ter entre 3 e 50 caracteres.")
    email: EmailStr
    phone: str = Field(..., pattern=r"^\+?[0-9\s\-()]{7,15}$", description="O número de telefone deve ser válido.")
    password: str = Field(..., min_length=8, description="A senha deve ter no mínimo 8 caracteres.")
    accepted_privacy_policy: bool

    @field_validator("password")
    def validate_password_field(cls, value: str) -> str:
        return validate_password(value)

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str
    is_verified: bool

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str = Field(..., description="Token de redefinição de senha")
    new_password: str = Field(..., min_length=8, description="A senha deve ter no mínimo 8 caracteres.")

    @field_validator("new_password")
    def validate_reset_password_field(cls, value: str) -> str:
        return validate_password(value)
