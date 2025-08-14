
class Config:
    BEAR_KEY="8932d6621045d6c18c8688feeb9a594e59bb464a1cb2e9645faa189ce24f4f00455c91bf6cb5f9eb2ca868e8d1a35c5b8081974f3257251e950b73c0c7cfccfd"

class DevelopmentConfig(Config):
    DEBUG=True

class ProductionConfig(Config):
    DEBUG=False