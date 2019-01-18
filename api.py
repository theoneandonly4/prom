import pymongo
import urllib
import datetime

uri = 'mongodb+srv://4:' + urllib.parse.quote_plus('J*6FC2968!&pi@4!2Mpq') + '@prometeus-dkhuk.azure.mongodb.net/test?retryWrites=true'
client = pymongo.MongoClient(uri)
db = client.prom
itm = db.itm

newItem = { "id": 0,
            "parent": 0,
            "type": "person",
            "name": 4,
}

res = itm.insert_one(newItem)
print('Integrated Data: ' + format(res.inserted_id))
