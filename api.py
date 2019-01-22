# Prometeus api server side Python
# By Pierre-Etienne ALBINET
# Started 20190117
# Changed 20190121

import pymongo
import urllib
import datetime

# Database connection
def dbc():
    uri = 'mongodb+srv://4:' + urllib.parse.quote_plus('J*6FC2968!&pi@4!2Mpq') + '@prometeus-dkhuk.azure.mongodb.net/test?retryWrites=true'
    client = pymongo.MongoClient(uri)
    return client.prom

# Read Item
def ritm(itmno):
    db = dbc()
    itm = db.itm
    q = {'id': itmno}
    try:
        res = itm.find(q, { '_id': 0})
        return res[0]
    except IndexError:
        return "{'error': 'not found'}"

# Create Item
def citm(id, prt, typ, nam):
    db = dbc()
    itm = db.itm
    newItem = { "id": id,
            "parent": prt,
            "type": typ,
            "name": nam,
            }
    res = itm.insert_one(newItem)
    return("{'Result': " + format(res.inserted_id) + "}")

# print(ritm(1))
# print(citm(0, 0, 'void', 'void'))