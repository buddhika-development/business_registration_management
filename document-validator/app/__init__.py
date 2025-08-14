from flask import Flask

from config import Config


def createApp(config: Config):

    app = Flask(__name__)
    app.config.from_object(config)

    return app