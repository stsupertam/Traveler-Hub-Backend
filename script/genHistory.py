#!/usr/bin/env python3
import requests
import sys
import json
import pymongo
import radar 
import datetime
from pymongo import MongoClient
from random import randint
from bson.objectid import ObjectId

PACKAGE = 'http://localhost:5000/package/'

def response_print(res):
    print()
    print('Response:')
    print(res.text)
    print('--------------------')
    print()

def get_data(filename):
    with open(filename, 'r') as file:
        data = file.read().splitlines()
    return data

def init_mogodb():
    client = MongoClient('localhost', 27017)
    db = client.testdb
    return db

def get_collection_field(db, collection, field):
    _id = []
    for item in db[collection].find({}):
        _id.append(item.get(field))
    return _id

def gen_history(total):
    ROOT_URL = PACKAGE
    db = init_mogodb()
    packagesId = get_collection_field(db, 'packages', '_id')
    emails = get_collection_field(db, 'users', 'email')

    histories = db.histories

    for i in range(total):
        date = radar.random_datetime(
            start = datetime.datetime(year=2017, month=1, day=1),
            stop = datetime.datetime(year=2017, month=3, day=31)
        )
        history = {
            'packageId': packagesId[randint(0, len(packagesId) - 1)],
            'email': emails[randint(0, len(emails) - 1)],
            'created': date
        }
        
        histories.insert_one(history)
        print('History was created')


if __name__ == '__main__':
    if sys.argv[1] == 'create':
        if len(sys.argv) == 3:
            gen_history(int(sys.argv[2]))
        else:
            gen_history(1)