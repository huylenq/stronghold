from django.http import HttpResponseRedirect, JsonResponse
import requests
from urllib.parse import urlencode


POCKET_CONSUMER_KEY = '71182-21ca899c29444251d8a1fc2d'
HOST_PREFIX = 'http://huylenq.com'
# HOST_PREFIX = 'http://192.168.0.101'
# HOST_PREFIX = 'http://localhost'


def pocket_authorize(request):
    request_token_resp = requests.post(
        'https://getpocket.com/v3/oauth/request',
        {
            'consumer_key': POCKET_CONSUMER_KEY,
            'redirect_uri': HOST_PREFIX,
        },
        headers={'X-Accept': 'application/json'})
    request_token = request_token_resp.json()['code']

    params = urlencode({
        'request_token': request_token,
        'redirect_uri': f'{HOST_PREFIX}/pocket?request_token={request_token}'
    })
    authorize_url = 'https://getpocket.com/auth/authorize?' + params
    return HttpResponseRedirect(authorize_url)


def pocket_fetch(request):
    access_token_resp = requests.post(
        'https://getpocket.com/v3/oauth/authorize',
        {
            'consumer_key': POCKET_CONSUMER_KEY,
            'code': request.GET.get('request_token')
        },
        headers={'X-Accept': 'application/json'})
    print(access_token_resp)
    access_token = access_token_resp.json()['access_token']
    unreads = requests.get('https://getpocket.com/v3/get', {'consumer_key': POCKET_CONSUMER_KEY, 'access_token': access_token, 'state': 'unread', 'favorite': 1}).json()['list']
    unread_items = [v for _, v in unreads.items()]
    for item in unread_items: item['type'] = 'unread'
    archives = requests.get('https://getpocket.com/v3/get', {'consumer_key': POCKET_CONSUMER_KEY, 'access_token': access_token, 'state': 'archive', 'favorite': 1}).json()['list']
    archive_items = [v for _, v in archives.items()]
    for item in archive_items: item['type'] = 'archive'
    return JsonResponse({'data': unread_items + archive_items})
