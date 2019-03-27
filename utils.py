# Python utilities
# By Pierre-Etienne ALBINET
# Started 20190327
# Changed 20190327

import random

def randomHex(length):
    return ''.join([random.choice('0123456789abcdef') for x in range(length)])

if __name__ == '__main__':
    print(randomHex(16))
