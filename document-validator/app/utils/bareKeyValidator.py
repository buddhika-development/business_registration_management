from flask import current_app

def bearKeyValidator(bear_key) -> bool:
    app_bear_key = current_app.config["BEAR_KEY"]

    if bear_key is None or bear_key != app_bear_key:
        return False

    return True