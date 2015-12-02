# Kim de Bie 11077379
# This Python script loads csv data into JSON objects.
# I previously used (an altered) version of this code for my 'Heuristieken' project.

import csv
import json
# Returns a dictionary with area names as keys and neighbours as values
def load_json(filename):

    # open provided file
    file_csv = open(filename, 'r')

    # create field names
    fieldnames = ("country", "gini")

    # initiate reader for the csv file
    reader = csv.DictReader(file_csv, fieldnames)

    # create list
    data = []

    # read all rows of csv_file and save them as lists (within list)
    for row in reader:
        data.append(row)

    # turn into JSON and save as textfile
    with open("jsondata.json", 'wb') as outfile:
        json.dump(data, outfile)

# call the load_json function
json_data = load_json("gini.csv")