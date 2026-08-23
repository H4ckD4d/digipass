#!/usr/bin/env python3
"""Serve the DSI dashboard locally on loopback only.

Project owner / original creator / primary maintainer: Chris Cruz | h4ckd4d

The server binds to 127.0.0.1 and serves only the repository's web/ directory.
It does not expose the dashboard to the local network and performs no external requests.
"""

from __future__ import annotations

import argparse
import functools
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "web"


def main() -> int:
    parser = argparse.ArgumentParser(description="Serve the DSI dashboard locally")
    parser.add_argument("--port", type=int, default=8765, help="Local TCP port (default: 8765)")
    args = parser.parse_args()

    if not 1024 <= args.port <= 65535:
        parser.error("port must be between 1024 and 65535")

    handler = functools.partial(SimpleHTTPRequestHandler, directory=str(WEB))
    server = ThreadingHTTPServer(("127.0.0.1", args.port), handler)
    print(f"DSI dashboard: http://127.0.0.1:{args.port}")
    print("Local loopback only. Press Ctrl+C to stop.")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping DSI dashboard.")
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
