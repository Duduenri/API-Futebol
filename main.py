import requests

# Sua chave de API da football-data.org
API_CHAVE = 'a8882e2d8cf24f5492df823d1d92ffe2'
URL = 'https://api.football-data.org/v4/'

# Função para obter informações de uma liga específica
def get_league_info(league_id):
    url = f'{URL}competitions/{league_id}'
    headers = {
        'X-Auth-Token': API_CHAVE
    }
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        print(f'Não consegui acessar: {response.status_code}')
        return None

# testanto a brincadeira
league_info = get_league_info(2021)
if league_info:
    print('Nome da Liga:', league_info['name'])
    print('Área:', league_info['area']['name'])
    print('Temporada Atual:', league_info['currentSeason']['startDate'], 'até', league_info['currentSeason']['endDate'])
