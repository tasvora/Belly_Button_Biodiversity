<<<<<<< HEAD
from app import app

if __name__ == "__main__":
    app.run()
=======
import os
from flaskapp import create_app

app = create_app(os.getenv("FLASK_CONFIG", default="config.DevelopmentConfig"))
>>>>>>> 320eb71d7b4fda59c4d6cd916c9d958f626b6de0
