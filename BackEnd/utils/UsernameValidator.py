import string


def username_validator(username):
    allowed = string.ascii_letters + string.digits + '_'
    assert all(char in allowed for char in username), "invalid username characters."
    assert len(username) >= 4, "username must be 4 characters or more."
    return username