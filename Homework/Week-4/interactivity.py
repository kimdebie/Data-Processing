# Kim de Bie 11077379
# This Python script loads csv data into JSON objects.
# I previously used (an altered) version of this code for my 'Heuristieken' project.

import csv
import json
# Returns a dictionary with area names as keys and neighbours as values
def load_json(filename):

    # open provided file
    file_csv = open(filename, 'r')

    # initiate reader for the csv file
    reader = csv.reader(file_csv)

    # create list
    data = []

    # read all rows of csv_file and save them as lists (within list)
    for row in reader:
    	data_element = [row[1], row[2]]
        data.append(data_element)

    # turn into JSON and save as textfile
    with open("jsondata.txt", 'wb') as outfile:
    	json.dump(data, outfile)

# call the load_json function
json_data = load_json("interactivity.csv")