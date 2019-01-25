# Prometeus api server side Python
# By Pierre-Etienne ALBINET
# Started 20190117
# Changed 20190121

import pymongo
import urllib
import datetime
from bson.objectid import ObjectId

# Database connection
def dbc():
    uri = 'mongodb+srv://4:' + urllib.parse.quote_plus('J*6FC2968!&pi@4!2Mpq') + '@prometeus-dkhuk.azure.mongodb.net/test?retryWrites=true'
    client = pymongo.MongoClient(uri)
    return client.prom

# Create Item
def citm(prt, typ, val, cry):
    db = dbc()
    itm = db.itm

    # Remove htmlspecialchars from all vars, escape other chars '{()}'

    # Add check on 'prt' value, must be an existing '_id' in db
    # Add check on 'typ' value, must be in a predefined list of values, exclude 'cfg' from list, only created by server
    # Add check on 'cry' value, must be 0 or 1

    newItem = {
    "prt": prt,
    "typ": typ,
    "val": val,
    "cry": cry
    }
    res = itm.insert_one(newItem)
    return {'Result': format(res.inserted_id)}

# Read Item
def ritm(id, prt, typ, val):
    db = dbc()
    itm = db.itm

    # Remove htmlspecialchars from all vars, escape other chars '{()}'

    q = {}
    if (id != '*'):
        q['_id'] = id
    if (prt != '*'):
        q['prt'] = prt
    if (typ != '*'):
        q['typ'] = typ
    if (val != '*'):
        q['val'] = val
    print(q)
    try:
        res = itm.find(q)
        t = []
        for x in res:
            t.append(x)
        return t
    except IndexError:
        return {'error': 'not found'}

# Delete Item
def ditm(id, prt, typ, val):
    db = dbc()
    itm = db.itm

    # Remove htmlspecialchars from all vars, escape other chars '{()}'
    
    q = {}
    if (id != '*'):
        q['_id'] = id
    if (prt != '*'):
        q['prt'] = prt
    if (typ != '*'):
        q['typ'] = typ
    if (val != '*'):
        q['val'] = val
    try:
        res = db.itm.delete_one(q)
        return {'deletedCount': str(res.deleted_count)}
    except IndexError:
        return {'error': 'not found'}

# print(ritm(1))
# print(citm(0, 0, 'void', 'void'))
# print(fitm('*', 0, '*', '*'))
