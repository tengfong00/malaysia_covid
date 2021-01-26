import requests
import json
import os
import re
import pymongo
from contextlib import closing
from bs4 import BeautifulSoup

client = pymongo.MongoClient("mongodb+srv://sims:BYsvXPiZMBOKfK7i@malaysiacovid.z5stk.mongodb.net/malaysiacovid?retryWrites=true&w=majority")    

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
    


def save_to_mongo(data):
    db = client["malaysiacovid"]
    collection = db["Stat"]

    # Insert data to db
    response = collection.insert(data)
    print ("Send successful")

    # Output data
    # cursor = collection.find({},{'_id': 0})
    # docs = list(cursor)
    # docs = docs[:5]
    # print(docs)



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

    output = {
        "TotalKes" : content[0],
        "ActiveKes" : content[1],
        "Dead" : content[2],
        "Recovered" : content[3],
        "Date": content[4]
    }

    save_to_mongo(output)

    # If you want to output to local JSON file
    # if os.path.getsize('stat.json') > 0:
    #     json_output = {
    #         "TotalKes" : content[0],
    #         "ActiveKes" : content[1],
    #         "Dead" : content[2],
    #         "Recovered" : content[3],
    #         "Date": content[4]
    #     }

    #     with open('stat.json') as json_file:
    #         data = json.load(json_file)
    #         temp = data['MalaysiaStat']
    #         temp.append(json_output)

    #     with open('stat.json', 'w') as f:
    #         json.dump(data, f, indent = 4)
    #     print ("Output1")
    # else:
    #     json_output = {
    #         "MalaysiaStat": [
    #             {
    #                 "TotalKes" : content[0],
    #                 "ActiveKes" : content[1],
    #                 "Dead" : content[2],
    #                 "Recovered" : content[3],
    #                 "Date": content[4]
    #             }
    #         ]
    #     }

    #     json_write = json.dumps(json_output, indent = 4)
        
    #     with open('stat.json', 'w') as outfile:
    #         outfile.write(json_write)
    #     print("Output2")

    # with open('stat.json') as json_file:
    #     bata = json.load(json_file)
        
    #     print (bata['MalaysiaStat'][0]['Dead'])