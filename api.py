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

# Create Item
def citm(id, prt, typ, val, cry):
    db = dbc()
    itm = db.itm
    newItem = { "id": id,
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
    q = {}
    if (id != '*'):
        q['id'] = id
    if (prt != '*'):
        q['prt'] = prt
    if (typ != '*'):
        q['typ'] = typ
    if (val != '*'):
        q['val'] = val
    print(q)
    try:
        res = itm.find(q, { '_id': 0})
        return res[0]
    except IndexError:
        return {'error': 'not found'}

# Read Item
def ditm(id, prt, typ, val):
    db = dbc()
    itm = db.itm
    q = {}
    if (id != '*'):
        q['id'] = id
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
