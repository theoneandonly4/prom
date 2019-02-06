# Prometeus Python initialiZation
# By Pierre-Etienne ALBINET
# Started 20190206
# Changed 20190206

import api

def chkcfg():
    cfg = ritm('*', 0, 'cfg', 'promCFG')
    if not cfg
