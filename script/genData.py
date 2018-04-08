#!/usr/bin/env python3
import sys
import pymongo
import bcrypt
import radar 
import datetime
from pymongo import MongoClient
from random import randint
from bson.objectid import ObjectId

def print_response(str, iter):
    print(f'{str} was updated [{iter+1}]')

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
    db = init_mogodb()
    packagesId = get_collection_field(db, 'packages', '_id')
    emails = get_collection_field(db, 'users', 'email')

    histories = db.histories

    for i in range(total):

        history = {
            'packageId': packagesId[randint(0, len(packagesId) - 1)],
            'email': emails[randint(0, len(emails) - 1)],
            'updated': radar.random_datetime(
                start = datetime.datetime(year=2017, month=1, day=1),
                stop = datetime.datetime(year=2017, month=3, day=31)
            )
        }
        
        histories.insert_one(history)
        print_response('History' , i)

def gen_user(total):
    db = init_mogodb()
    gender = ['male', 'female']

    users = db.users

    hashed_password = '$2a$10$mRKydZYcfTmIciCfbZoyauCCvvw2Y3Vn9DigyvyspjDN6KPQgkH1K'
    for i in range(total):
        user = {
            'email': str(randint(10000, 1000000)) + '@email.com',
            'password': hashed_password,
            'gender': gender[randint(0,1)],
            'age': radar.random_datetime(
                start = datetime.datetime(year=1965, month=1, day=1),
                stop = datetime.datetime(year=2002, month=12, day=31)
            )
        }
        users.insert_one(user)
        print_response('User' , i)

def gen_favorite(total):
    db = init_mogodb()
    packagesId = get_collection_field(db, 'packages', '_id')
    emails = get_collection_field(db, 'users', 'email')

    favorites = db.favorites
    packages = db.packages

    for i in range(total):

        favorite = {
            'packageId': packagesId[randint(0, len(packagesId) - 1)],
            'email': emails[randint(0, len(emails) - 1)],
            'updated': radar.random_datetime(
                start = datetime.datetime(year=2017, month=1, day=1),
                stop = datetime.datetime(year=2017, month=3, day=31)
            ),
            'like': bool(randint(0,1))
        }

        if favorite['like']:
            packages.update({ '_id':ObjectId(favorite['packageId']) }, 
                { '$inc': { 'like': 1 } })
        else:
            packages.update({ '_id':ObjectId(favorite['packageId']) }, 
                { '$inc': { 'dislike': 1 } })
        
        favorites.insert_one(favorite)
        print_response('Favorite' , i)

def gen_bookmark(total):
    db = init_mogodb()
    packagesId = get_collection_field(db, 'packages', '_id')
    emails = get_collection_field(db, 'users', 'email')

    bookmarks = db.bookmarks
    packages = db.packages

    for i in range(total):

        bookmark = {
            'packageId': packagesId[randint(0, len(packagesId) - 1)],
            'email': emails[randint(0, len(emails) - 1)],
            'updated': radar.random_datetime(
                start = datetime.datetime(year=2017, month=1, day=1),
                stop = datetime.datetime(year=2017, month=3, day=31)
            ),
            'bookmark': bool(randint(0,1))
        }

        bookmarks.insert_one(bookmark)
        print_response('Bookmark' , i)

if __name__ == '__main__':
    if sys.argv[2] == 'create':
        if len(sys.argv) == 4:
            if sys.argv[1] == 'history':
                gen_history(int(sys.argv[3]))
            elif sys.argv[1] == 'user':
                gen_user(int(sys.argv[3]))
            elif sys.argv[1] == 'favorite':
                gen_favorite(int(sys.argv[3]))
            elif sys.argv[1] == 'bookmark':
                gen_bookmark(int(sys.argv[3]))
            else:
                print('Error. Can generate only history or user.')
        elif len(sys.argv) == 3:
            if sys.argv[1] == 'history':
                gen_history(1)
            elif sys.argv[1] == 'user':
                gen_user(1)
            elif sys.argv[1] == 'favorite':
                gen_user(1)
            elif sys.argv[1] == 'bookmark':
                gen_bookmark(1)
            else:
                print('Error. Can generate only history or user.')
        else:
            print('Error. Please try again.')