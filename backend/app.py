from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from database import MongoDB
from routes import auth_bp, workout_bp, exercise_bp, session_bp, workout_set_bp
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS for React Native frontend
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://*", "http://*"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Accept", "Authorization", "Content-Type", "X-CSRF-Token"],
        "expose_headers": ["Link"],
        "supports_credentials": True,
        "max_age": 300
    }
})

# Initialize MongoDB connection
try:
    MongoDB.connect()
    logger.info("✅ MongoDB connection initialized")
except Exception as e:
    logger.error(f"❌ Failed to connect to MongoDB: {e}")
    logger.error("⚠️  Server will start but database operations will fail")

# Register blueprints (routes)
app.register_blueprint(auth_bp)
app.register_blueprint(workout_bp)
app.register_blueprint(exercise_bp)
app.register_blueprint(session_bp)
app.register_blueprint(workout_set_bp)

# Health check endpoint
@app.route('/', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'running',
        'message': 'EverGain Backend is running!',
        'version': '2.0.0',
        'tech_stack': 'Flask + MongoDB'
    }), 200

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    import traceback
    logger.error(f"❌ Internal server error: {error}")
    logger.error(f"Traceback:\n{traceback.format_exc()}")
    return jsonify({'error': 'Internal server error'}), 500

# Cleanup on shutdown
@app.teardown_appcontext
def shutdown_session(exception=None):
    """Close MongoDB connection on app shutdown"""
    MongoDB.close()

if __name__ == '__main__':
    logger.info(f"🚀 Starting EverGain Backend on port {Config.PORT}")
    logger.info(f"🔧 Environment: {Config.FLASK_ENV}")
    app.run(
        host='0.0.0.0',
        port=Config.PORT,
        debug=(Config.FLASK_ENV == 'development')
    )
