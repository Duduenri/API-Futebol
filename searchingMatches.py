import requests

# Chave
API_CHAVE = 'a8882e2d8cf24f5492df823d1d92ffe2'
URL = 'https://api.football-data.org/v4/'

# def time_id(nome_time):
#     url = f'{URL}teams'
#     headers = { #o headers é um DICIONARIOS, que contem os cabeçalhos HTTP, ele envia um requisição
#         'X-Auth-Token': API_CHAVE
#     }
#     response = requests.get(url, headers=headers)

#     if response.status_code == 200:
#         times = response.json()['teams']
#         for time in times:
#             if nome_time.lower() in time['name'].lower():
#                 return time['id']
#         print(f'Time "{nome_time}" não encontrado.')
#     else:
#         print(f'Erro ao acessar a API: {response.status_code}')
#     return None

# def proximas_cinco_partidas(team_id)
def mostrar_ligas():
    url = f'{URL}competitions'
    headers = { #o headers é um DICIONARIOS, que contem os cabeçalhos HTTP, ele envia um requisição
        'X-Auth-Token': API_CHAVE
    }
    response = requests.get(url, headers=headers) #headers é usado para enviar cabeçalhos HTTP, requisição

    if response.status_code == 200:
        competicoes = response.json()['competitions']
        ligas = [comp for comp in competicoes if comp['type'] == 'LEAGUE' and comp['plan'] == 'TIER_ONE']
        return ligas
    else:
        print(f'Erro ao acessar a API: {response.status_code}')
        return None

def selecionar_liga():
    ligas = mostrar_ligas()
    if not ligas:
        return None
    
    print("Ligas disponíveis:")
    for i, liga in enumerate(ligas): #loop
        print(f"{i + 1}: {liga['name']} ({liga['code']})")

    try:
        escolha = int(input("\nSelecione o número da liga: ")) - 1 #como as opções apresentadas começam com 1, é necessario incluir o -1 para ajustar o indice
        if 0 <= escolha < len(ligas):
            return ligas[escolha]['id']
        else:
            print("Opção inválida.")
            return None
    except ValueError: #excessao, caso a operaçãp receba um argumento certo mas com valor inapropriado
        print("Entrada inválida. Por favor, insira um número.")
        return None

def times_por_liga(ligas_id):
    url = f'{URL}competitions/{ligas_id}/teams'
    headers = {
        'X-Auth-Token': API_CHAVE
    }
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        return response.json()['teams']
    else:
        print(f'Erro ao acessar a API: {response.status_code}')
        return None
    
#Def para obter o id de um time pelo nome fornecido
def pegar_id_time(nome_time, times):
    for time in times:
        if nome_time.lower() in time['name'].lower():
            return time['id']
    print(f'Time "{nome_time}" não encontrado.')
    return None

def proximas_cinco_partidas(time_id):
    url = f'{URL}teams/{time_id}/matches?status=SCHEDULED&limit=5'
    headers = {
        'X-Auth-Token': API_CHAVE
    }
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        partidas = response.json()['matches']
        return partidas
    else:
        print(f'Erro ao acessar a API: {response.status_code}')
        return None
    
def ultimas_cinco_partidas(time_id):
    url = f'{URL}teams/{time_id}/matches?status=FINISHED&limit=5'
    headers = {
        'X-Auth-Token': API_CHAVE
    }
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        partidas = response.json()['matches']
        return partidas
    else:
        print(f'Erro ao acessar a API: {response.status_code}')
        return None
    
def pesquisar_time_e_mostrar_partidas(nome_time, id_liga):
    times = times_por_liga(id_liga)
    if not times:
        return None
    
    id_time = pegar_id_time(nome_time, times)
    if id_time:
        print(f'\nPróximos 5 jogos do {nome_time}:')
        proximas_partidas = proximas_cinco_partidas(id_time)
        if proximas_partidas:
            for partida in proximas_partidas:
                print(f"{partida['utcDate']} - {partida['homeTeam']['name']} vs {partida['awayTeam']['name']}")

    print(f'\núltimos 5 jogos do {nome_time}:')
    ultimas_partidas = ultimas_cinco_partidas(id_time)
    if ultimas_partidas:
        for partida in ultimas_partidas:
                print(f"{partida['utcDate']} - {partida['homeTeam']['name']} {partida['score']['fullTime']['home']} x {partida['score']['fullTime']['away']} {partida['awayTeam']['name']}")

# testando a brincadeira
if __name__ == "__main__": #__name__ é uma condição para saber se o script esta sendo executado diretamente ou umportador
    #exibe as ligas e mostra uma
    liga_id = selecionar_liga()
    if liga_id:
        nome_time = input("\nDigite o nome do time: ")
        pesquisar_time_e_mostrar_partidas(nome_time, liga_id)