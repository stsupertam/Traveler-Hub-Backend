#!/usr/bin/env python3
from random import randint
import requests
import sys
import json

USER_API_ROOT = 'http://localhost:5000/user'

def response_print(res):
    print()
    print('Response:')
    print(res.text)
    print('--------------------')
    print()

def gen_user(total):
    URL = USER_API_ROOT
    headers = {'Content-type': 'application/json'}
    emails = []
    for i in range(total):
        payload = {
            'email': str(randint(10000, 1000000)) + '@email.com',
            'password': '1'
        }

        res = requests.post(URL, data=json.dumps(payload), headers=headers)

        if res.status_code == 200 or res.status_code == 201:
            print(payload['email'], 'was created')
        else:
            print(payload['email'], 'wasn\'t created')

        emails.append(payload['email'])
    print('Finish')

if __name__ == '__main__':
    print(sys.argv)
    if sys.argv[1] == 'create':
        if len(sys.argv) == 3:
            gen_user(int(sys.argv[2]))
        else:
            gen_user(1)