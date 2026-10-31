import http.server, os, sys
ROOT='/home/claude/video8'
class H(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        path=path.split('?')[0]
        if path.startswith('/__render/'): return os.path.join(ROOT,'render',path[len('/__render/'):])
        return os.path.join(ROOT,'public',path.lstrip('/'))
    def log_message(self,*a): pass
http.server.ThreadingHTTPServer(('127.0.0.1',int(sys.argv[1]) if len(sys.argv)>1 else 8765),H).serve_forever()
