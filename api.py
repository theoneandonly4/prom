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
    err = {}

    # Remove htmlspecialchars from all vars, escape other chars '{()}' > Done in server.py

    # Check on 'prt' value, must be an existing '_id' in db
    prtItm = ritm(prt, '*', '*', '*')
    if (not prtItm) and (not prt == 0):
        err['error'] = True
        err['prtError'] = 'The specified Parent item (' + prt + ') does not exist'

    # Check on 'typ' value, must be in a predefined list of values, exclude 'cfg' from list, only created by server
    #TODO change to all values of tmplt with prt = 0 + tmplt, datyp & value
    types = ['tmplt', 'orgzt', 'prson', 'systm', 'objct', 'datyp', 'value']
    if not typ in types:
        err['error'] = True
        err['typError'] = 'The specified type (' + typ + ') is not valid'

    # Check on 'cry' value, must be 0 or 1
    if (not cry == 0) and (not cry == 1):
        err['error'] = True
        err['cryError'] = 'The specified crypt (' + cry +') is not valid'

    if not err:
        newItem = {
        "prt": prt,
        "typ": typ,
        "val": val,
        "cry": cry
        }
        res = itm.insert_one(newItem)
        return {'result': format(res.inserted_id)}
    else:
        return err

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
            x['_id'] = str(x['_id'])
            if not x['prt'] == 0:
                x['prt'] = str(x['prt'])
            t.append(x)
        if not t:
            t = {'error': 'not found'}
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
