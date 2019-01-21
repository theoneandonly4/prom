# Prometeus Python Server & routing
# By Pierre-Etienne ALBINET
# Started 20190117
# Changed 20190121

from http.server import BaseHTTPRequestHandler, HTTPServer
import time
import os
from os import curdir, sep
import json
import urllib
import api
#import ssl

path = os.path.abspath(curdir)
hostName = 'localhost'
hostPort = 4443

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            f = open(path + sep + 'index.html', 'rb')
            response = f.read()
            f.close()
            mimetype = 'text/html'
        elif self.path == '/api.js':
            f = open(path + sep + 'api.js', 'rb')
            response = f.read()
            f.close()
            mimetype = 'application/javascript'
        elif self.path == '/style.css':
            f = open(path + sep + 'style.css', 'rb')
            response = f.read()
            f.close()
            mimetype = 'text/css'
        elif self.path.endswith('.png'):
            f = open(path + sep + self.path, 'rb')
            response = f.read()
            f.close()
            mimetype = 'image/png'
        elif self.path[:5] == '/ritm':
            params = urllib.parse.parse_qs(self.path[6:])
            itm = (params['itm'][0])
            response = json.dumps(api.ritm(itm)).encode('utf-8')
            mimetype = 'application/json'
        self.send_response(200)
        self.send_header('Content-type', mimetype)
        self.end_headers()
        self.wfile.write(response)

    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({'Pwet': 'Pwet', 'Tagada': 'Tsoin Tsoin'}).encode('utf-8'))


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
