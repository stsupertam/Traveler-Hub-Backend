#!/usr/bin/env python3
from random import randint
import requests
import sys
import json
import radar 
import datetime
import pymongo
from pymongo import MongoClient

def response_print(res):
    print()
    print('Response:')
    print(res.text)
    print('--------------------')
    print()

def init_mogodb():
    client = MongoClient('localhost', 27017)
    db = client.testdb
    return db

def gen_user(total):
    gender = ['male', 'female']
    for i in range(total):
        payload = {
            'email': str(randint(10000, 1000000)) + '@email.com',
            'password': '1',
            'gender': gender[randint(0,1)],
            'age': radar.random_datetime(
                start = datetime.datetime(year=1965, month=1, day=1),
                stop = datetime.datetime(year=2002, month=12, day=31)
            )
        }
    print('User was created')

if __name__ == '__main__':
    print(sys.argv)
    if sys.argv[1] == 'create':
        if len(sys.argv) == 3:
            gen_user(int(sys.argv[2]))
        else:
            gen_user(1)