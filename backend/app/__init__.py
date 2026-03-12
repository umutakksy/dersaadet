from flask import Flask
from flask_cors import CORS
from app.config import Config
from database.mongo import mongo_db

import os
from flask import send_from_directory

def create_app(config_class=Config):
    app = Flask(__name__, static_folder='static', static_url_path='')
    app.config.from_object(config_class)
    # Initialize CORS for frontend communication
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    # Initialize DB and folders
    mongo_db.connect(app.config['MONGO_URI'])
    config_class.init_app(app)
    
    # Import and register blueprints
    from api.upload_routes import upload_bp
    from api.job_routes import job_bp
    from api.result_routes import result_bp
    
    app.register_blueprint(upload_bp)
    app.register_blueprint(job_bp)
    app.register_blueprint(result_bp)

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(app.static_folder + '/' + path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')
    
    return app
