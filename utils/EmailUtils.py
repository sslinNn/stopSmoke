

def create_username_by_email(email: str) -> str:
    return email.split("@")[0]