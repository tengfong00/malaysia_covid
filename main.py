import requests
import json
import re
from contextlib import closing
from bs4 import BeautifulSoup

# Get Covid Content
def get_iframe(target): 
    req = requests.get(url = target)
    req.encoding = 'utf-8'
    html = req.text
    bf = BeautifulSoup(html, 'lxml')

    #Get Data
    Value = re.finditer(r"(?<=\"text\":\")(\d|,)+(?=\")", str(bf), re.MULTILINE)
    UpdatedDate = re.finditer(r"(?<=updatedAt\":\")[^\"]+(?=\")", str(bf), re.MULTILINE)

    Datta = []
    Datee = []

    for bla, blaa in enumerate(UpdatedDate, start = 1):
        Datee.append(format(blaa.group()))

    for matchesNum, match in enumerate(Value, start = 1):
        Datta.append(format(match.group()))

    TotalKes = Datta[0]
    ActiveKes = Datta[1]
    Dead = Datta[2]
    Recover = Datta[3]
    Dataa = [TotalKes, ActiveKes, Dead, Recover]

    Dattaa = [re.sub(r'[^a-zA-Z0-9 ]', '', i) for i in Dataa]
    Dattaa.append(Datee[0])

    return Dattaa
    
    

if __name__ == '__main__':
        target = 'http://covid-19.moh.gov.my/'

        req = requests.get(url = target)
        req.encoding = 'utf-8'
        html = req.text
        bs = BeautifulSoup(html, 'lxml')

        #Get Infogram
        texts = bs.find('section', id='g-intro')
        infogram_script = texts.find('script')
        infogram_id = infogram_script['id']
        infogram_id = re.search("(?<=_)[^_]+$", infogram_id).group()
        
        #IframeURL
        iframeUrl = 'https://e.infogram.com/' + infogram_id

        content = get_iframe(iframeUrl)
        
        # JSON 
        json_output = {
            "TotalKes" : content[0],
            "ActiveKes" : content[1],
            "Dead" : content[2],
            "Recovered" : content[3],
            "Date": content[4]
        }

        json_write = json.dumps(json_output, indent = 4)

        with open('stat.json', 'w') as outfile:
            outfile.write(json_write)

        with open('stat.json') as json_file:
            bata = json.load(json_file)
            
            print (bata['Dead'])