from app import create_app

app = create_app()

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8088))
    # Windows + Python 3.13 stability fix: disable reloader if experiencing WinError 10038
    app.run(host="0.0.0.0", port=port, debug=True, use_reloader=False, threaded=True)
