#!/usr/bin/env python3
"""Serve the CrisisTrust reference MVP on loopback only.

No telemetry or external requests are added by this server.
"""

from __future__ import annotations

from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os

ROOT = Path(__file__).resolve().parents[1] / "web"
HOST = "127.0.0.1"
PORT = 8771


def main() -> None:
    os.chdir(ROOT)
    server = ThreadingHTTPServer((HOST, PORT), SimpleHTTPRequestHandler)
    print(f"CrisisTrust local MVP: http://{HOST}:{PORT}")
    print("Loopback only. Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
