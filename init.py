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
    admId = 0
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
    adm = api.ritm('*', '*', 'adm', 'promADM')
    if adm[0]['_id'] == 'not found':
        admPsn = api.citm(ObjectId(tmpIds['prson']), 'prson', 'Admin', 0, 'server')['result']
        print('Admin Created')
        admId = api.citm(ObjectId(admPsn), 'adm', 'promADM', 0, 'server')['result']
        print('Admin Rights created')
    else:
        admId = adm[0]['_id']
        print('Admin OK')

    #Adming Password check
    print('Checking Admin Password Item...')
    admPass = api.ritm('*', ObjectId(admId), 'datyp', 'Password')
    if admPass[0]['_id'] == 'not found':
        admPsw = api.citm(ObjectId(admId), 'datyp', 'Password', 0, 'server')['result']
        print('Admin Password Item Created')
    else:
        admPsw = admPass[0]['_id']
        print('Admin Password Item OK')

    print('Checking Admin Password Value...')
    admPassVal = api.ritm('*', ObjectId(admPsw), 'value', '*')
    if admPassVal[0]['_id'] == 'not found':
        status = False
        print('Server Status set to Admin Password, connect to the Client to finish set-up')
    else:
        print('Admin Password Value OK')
        status = True

    print('Setting Database Status to: ' + str(status))
    dbStatus = api.ritm('*', 'cfgId', 'datyp', 'Status')
    if dbStatus[0]['_id'] == 'not found':
        statusId = api.citm(ObjectId(cfgId), 'datyp', 'Status', 0, 'server')['result']
        statusValId = api.citm(ObjectId(statusId), 'value', status, 0, 'server')['result']
    else:
        statusVal = ritm('*', dbStatus[0]['_id'], 'datyp', 'Status')
        if statusVal[0]['_id'] == 'not found':
            statusValId = api.citm(ObjectId(statusId), 'value', status, 0, 'server')['result']
        else:
            statusValId = statusVal[0]['_id']
            api.uitm(ObjectId('statusValId'), dbStatus[0]['_id'], 'value', status, 0, 'server')
