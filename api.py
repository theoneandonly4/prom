# Prometeus api server side Python
# By Pierre-Etienne ALBINET
# Started 20190117
# Changed 20190121

import pymongo
import urllib
import datetime
from bson import ObjectId

# Database connection
def dbc():
    uri = 'mongodb+srv://4:' + urllib.parse.quote_plus('J*6FC2968!&pi@4!2Mpq') + '@prometeus-dkhuk.azure.mongodb.net/test?retryWrites=true'
    client = pymongo.MongoClient(uri)
    return client.prom

# Create Item
def citm(prt, typ, val, cry, source):
    db = dbc()
    itm = db.itm
    err = {}
    err['error'] = False
    if not prt == 0:
        prt = ObjectId(prt)

    # Remove htmlspecialchars from all vars, escape other chars '{()}' > Done in server.py

    # Check on 'prt' value, must be an existing '_id' in db
    prtItm = ritm(prt, '*', '*', '*')
    if (prtItm[0]['_id'] == 'not found') and (not prt == 0):
        err['error'] = True
        err['txtError'] = 'The specified Parent item (' + prt + ') does not exist. '

    # Check on 'typ' value, must be in a predefined list of values, exclude 'cfg' from list, only created by server
    #TODO change to all values of tmplt with prt = 0 + tmplt, datyp & value
    types = ['tmplt', 'orgzt', 'prson', 'systm', 'objct', 'datyp', 'value']
    if source == 'server':
        types.append('cfg')
        types.append('adm')
        types.append('tmplt')
    if not typ in types:
        if (err['error']):
            err['txtError'] = err['txtError'] + 'The specified type (' + typ + ') is not valid. '
        else:
            err['txtError'] = 'The specified type (' + typ + ') is not valid. '
            err['error'] = True

    # Check on 'cry' value, must be 0 or 1
    if (not cry == 0) and (not cry == 1):
        if (err['error']):
            err['txtError'] = err['txtError'] + 'The specified crypt indicator (' + cry +') is not valid'
        else:
            err['txtError'] = 'The specified crypt (' + cry +') is not valid'
            err['error'] = True

    #TODO Add duplicate checks !!!

    if err['error']:
        return err
    else:
        newItem = {
        "prt": prt,
        "typ": typ,
        "val": val,
        "cry": cry
        }
        res = itm.insert_one(newItem)
        return {'result': format(res.inserted_id)}

# Update Item
def uitm(id, prt, typ, val, cry, source):
    db = dbc()
    itm = db.itm
    err = {}
    id = ObjectId(id)
    prt = ObjectId(prt)


    # Remove htmlspecialchars from all vars, escape other chars '{()}' > Done in server.py

    q = {}
    if (id != '*'):
        q['_id'] = id
    else:
        err['error'] = True
        err['prtError'] = 'Please provide an id'

    print(q)
    # Check if the provided id exists
    Itm = ritm(id, '*', '*', '*')
    if (not Itm):
        err['error'] = True
        err['prtError'] = 'The specified item (' + prt + ') does not exist'

    # Check on 'prt' value, must be an existing '_id' in db
    prtItm = ritm(prt, '*', '*', '*')
    if (prtItm[0]['_id'] == 'not found') and (not prt == 0):
        err['error'] = True
        err['txtError'] = 'The specified Parent item (' + prt + ') does not exist. '

    # Check on 'typ' value, must be in a predefined list of values, exclude 'cfg' from list, only created by server
    #TODO change to all values of tmplt with prt = 0 + tmplt, datyp & value
    types = ['tmplt', 'orgzt', 'prson', 'systm', 'objct', 'datyp', 'value']
    if source == 'server':
        types.append('cfg')
        types.append('adm')
        types.append('tmplt')
    if not typ in types:
        if (err['error']):
            err['txtError'] = err['txtError'] + 'The specified type (' + typ + ') is not valid. '
        else:
            err['txtError'] = 'The specified type (' + typ + ') is not valid. '
            err['error'] = True

    # Check on 'cry' value, must be 0 or 1
    if (not cry == 0) and (not cry == 1):
        if (err['error']):
            err['txtError'] = err['txtError'] + 'The specified crypt indicator (' + cry +') is not valid'
        else:
            err['txtError'] = 'The specified crypt (' + cry +') is not valid'
            err['error'] = True

    if err:
        return err
    else:
        newItem = {
            "$set": {
                "prt": prt,
                "typ": typ,
                "val": val,
                "cry": cry
            }
        }
        print(newItem)
        res = itm.update_one(q, newItem, False)
        return {'result': 'record updated'}

# Read Item
def ritm(id, prt, typ, val):
    db = dbc()
    itm = db.itm

    # Remove htmlspecialchars from all vars, escape other chars '{()}'
    q = {}
    if (id != '*'):
        id = ObjectId(id)
        q['_id'] = id
    if (prt != '*'):
        if (prt != 0):
            prt = ObjectId(prt)
        q['prt'] = prt
    if (typ != '*'):
        q['typ'] = typ
    if (val != '*'):
        q['val'] = val
    try:
        res = itm.find(q)
        t = []
        for x in res:
            x['_id'] = str(x['_id'])
            if not x['prt'] == 0:
                if x['typ'] == 'value':
                    x['prt'] = str(x['prt'])
                    prt = ritm(ObjectId(x['prt']), '*', 'datyp', '*')
                    if prt[0]['_id'] == 'not found':
                        return [{'_id': 'not found'}]
                    else:
                        if prt[0]['val'] == 'passcode' or prt[0]['val'] == 'uKey':
                            x['val'] = 'hidden'
            t.append(x)
        if not t:
            t = [{'_id': 'not found'}]
        return t
    except IndexError:
        return [{'_id': 'not found'}]

# Delete Item
def ditm(id, prt, typ, val):
    db = dbc()
    itm = db.itm
    id = ObjectId(id)

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

def tree(id, prt, typ, val, lvlup, lvldown):
    data = []
    itm = ritm(id, prt, typ, val)
    data.append(itm[0])
    if itm[0]['_id'] != 'not found':
        if lvldown != 0:
            addData = data
            for i in range(lvldown):
                searchData = addData
                addData = []
                for i in searchData:
                    addItems = ritm('*', ObjectId(i['_id']), '*', '*')
                    if addItems[0]['_id'] != 'not found':
                        for j in addItems:
                            addData.append(j)
                for k in addData:
                    data.append(k)
        if lvlup != 0:
            lvl = lvlup
            goUp = True
            prtid = itm[0]['prt']
            while goUp:
                prtitm = ritm(ObjectId(prtid), '*', '*', '*')
                if prtitm[0]['_id'] == 'not found' or prtitm[0]['_id'] == 0:
                    goUp = False
                else:
                    prtid = prtitm[0]['prt']
                    data.append(prtitm[0])
                    lvl = lvl - 1
                    if lvl == 0:
                        goUp = False
        return data
    else:
        return [{'_id': 'not found'}]
