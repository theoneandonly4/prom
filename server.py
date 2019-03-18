# Prometeus Python Server & routing
# By Pierre-Etienne ALBINET
# Started 20190117
# Changed 20190206

# Import from Python
from http.server import BaseHTTPRequestHandler, HTTPServer
import time
import os
from os import curdir, sep
import json
import urllib
import sys
import html
#import ssl

# Import own
import api
import init

version = '0.0.1'
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
        elif self.path == '/style.css':
            f = open(path + sep + 'style.css', 'rb')
            response = f.read()
            f.close()
            mimetype = 'text/css'
        elif self.path.endswith('.js'):
            f = open(path + sep + self.path, 'rb')
            response = f.read()
            f.close()
            mimetype = 'application/javascript'
        elif self.path.endswith('.png'):
            f = open(path + sep + self.path, 'rb')
            response = f.read()
            f.close()
            mimetype = 'image/png'
        # elif self.path.endswith('.ico'):
        #     f = open(path + sep + self.path, 'rb')
        #     response = f.read()
        #     f.close()
        #     mimetype = 'image/ico'
        elif self.path[:5] == '/ritm':
            data = urllib.parse.parse_qs(self.path[6:])
            id = html.escape(data['id'][0])
            prt = html.escape(data['prt'][0])
            if prt == '0':
                prt = 0
            typ = html.escape(data['typ'][0])
            val = html.escape(data['val'][0])
            response = json.dumps(api.ritm(id, prt, typ, val, 'client')).encode('utf-8')
            mimetype = 'application/json'
        else:
            self.send_error(404)
            return

        self.send_response(200)
        self.send_header('Content-type', mimetype)
        self.end_headers()
        self.wfile.write(response)

    def do_POST(self):
        if self.path[:5] == '/citm':
            data = urllib.parse.parse_qs(self.rfile.read(int(self.headers.get('content-length'))).decode('utf-8'))
            prt = html.escape(data['prt'][0])
            typ = html.escape(data['typ'][0])
            val = html.escape(data['val'][0])
            cry = int(html.escape(data['cry'][0]))
            response = json.dumps(api.citm(prt, typ, val, cry, 'client')).encode('utf-8')
            mimetype = 'application/json'
        elif self.path[:5] == '/uitm':
            data = urllib.parse.parse_qs(self.rfile.read(int(self.headers.get('content-length'))).decode('utf-8'))
            id = html.escape(data['id'][0])
            prt = html.escape(data['prt'][0])
            typ = html.escape(data['typ'][0])
            val = html.escape(data['val'][0])
            cry = int(html.escape(data['cry'][0]))
            response = json.dumps(api.uitm(id, prt, typ, val, cry, 'client')).encode('utf-8')
            mimetype = 'application/json'
        elif self.path[:5] == '/gettoken':
            data = urllib.parse.parse_qs(self.rfile.read(int(self.headers.get('content-length'))).decode('utf-8'))
            id = html.escape(data['id'][0])
            passcode = html.escape(data['passcode'][0])
            response = json.dumps(api.gettoken(id, passcode, 'client')).encode('utf-8')
            mimetype = 'application/json'
        else:
            self.send_error(404)
            return

        self.send_response(200)
        self.send_header('Content-type', mimetype)
        self.end_headers()
        self.wfile.write(response)


#TODO Define server initialiZation - creation of cfg with parent 0, templates for orgzt, prson, systm and objct. And version if it does not exist.

status = init.checks()

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
