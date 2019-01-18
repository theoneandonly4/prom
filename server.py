from http.server import BaseHTTPRequestHandler, HTTPServer
import time
import os
from os import curdir, sep
#import ssl

path = os.path.abspath(curdir)
hostName = 'localhost'
hostPort = 4443

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        f = open(path + sep + 'index.html', 'rb')
        # self.wfile.write(bytes("<html><head><title>Title goes here.</title></head>", "utf-8"))
        # self.wfile.write(bytes("<body><p>This is a test.</p>", "utf-8"))
        # self.wfile.write(bytes("<p>You accessed path: %s</p>" % self.path, "utf-8"))
        # self.wfile.write(bytes("</body></html>", "utf-8"))
        self.wfile.write(f.read())
        f.close()

server = HTTPServer((hostName, hostPort), Handler)
print(time.asctime(), "Server Starts - %s:%s" % (hostName, hostPort))


# httpd.socket = ssl.wrap_socket(server.socket,
#                                server_side=True,
#                                certfile='localhost.pem',
#                                ssl_version=ssl.PROTOCOL_TLSv1)
try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
    server.server_close()
    print(time.asctime(), "Server Stops - %s:%s" % (hostName, hostPort))
