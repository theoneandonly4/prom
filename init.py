# Prometeus Python initialiZation
# By Pierre-Etienne ALBINET
# Started 20190206
# Changed 20190206

import api
from bson import ObjectId

def checks():
    # Config Item Check
    print('Checking Config...')
    cfg = api.ritm('*', 0, 'cfg', 'promCFG')
    if cfg[0]['_id'] == 'not found':
        cfgId = api.citm(0, 'cfg', 'promCFG', 0, 'server')['result']
        print('Config Item created')
    else:
        cfgId = cfg[0]['_id']
        print('Config OK')

    # Template Item Check
    print('Checking Templates...')
    tpl = api.ritm('*', 0, 'tmplt', '*')
    model = ['orgzt', 'prson', 'systm', 'objct']
    tmpIds = {}
    action = False
    for x in model:
        found = False
        for y in tpl:
            if tpl[0]['_id'] == 'not found':
                break
            elif y['val'] == x:
                found = True
                break
        if not found:
            action = True
            id = api.citm(0, 'tmplt', x, 0, 'server')['result']
            print('Template ' + x + 'created')
            tmpIds[x] = id
        else:
            tmpIds[x] = y['_id']
    if not action:
        print('Templates OK')


    #Admin check
    print('Checking Admin...')
    adm = api.ritm('*', 0, 'adm', 'promADM')
    if adm[0]['_id'] == 'not found':
        admPsn = api.citm(ObjectId(tmpIds['prson']), 'prson', 'Admin', 0, 'server')['result']
        print('Admin Created')
        admId = api.citm(0, 'adm', 'promADM', 0, 'server')['result']
        print('Admin Rights created')
    else:
        admId = adm[0]['_id']
        print('Admin OK')
