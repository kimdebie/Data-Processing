#!/usr/bin/env python
# Name: Kim de Bie
# Student number: 11077379
'''
This script scrapes IMDB and outputs a CSV file with highest ranking tv series.
'''
# IF YOU WANT TO TEST YOUR ATTEMPT, RUN THE test-tvscraper.py SCRIPT.
import csv

from pattern.web import URL, DOM

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest ranking TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Ranking
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''

    # download DOM and store it in dom
    url = URL(TARGET_URL)
    dom = DOM(url.download(cached=True))

    # empty list that will eventually contain all series
    allseries = []

    for entry in dom.by_tag('td.title'):

        #all values are eventually ASCII-encoded to prevent issues when writing to csv
        title = entry.by_tag('a')[0].content
        title = title.encode('ascii', 'ignore')
        ranking = entry.by_tag('span.value')[0].content
        ranking = ranking.encode('ascii', 'ignore')

        # all genres saved into list
        genres = []
        for g in entry.by_tag('span.genre')[0].by_tag('a'):
            genre = g.content
            genres.append(genre)

        # list converted to string for pretty printing
        s = ', '
        genres = s.join(genres)
        genres = genres.encode('ascii', 'ignore')  

        # all actors saved into list
        actors = []
        for a in entry.by_tag('span.credit')[0].by_tag('a'):
            actor = a.content
            actors.append(actor)

        # list converted to string for pretty printing
        s = ', '
        actors = s.join(actors)
        actors = actors.encode('ascii', 'ignore')  

        # for runtime, only numerical value is stored
        runtime = entry.by_tag('span.runtime')[0].content
        runtime = runtime.split()[0]
        
        # separate list for each series is created and added to list of all series
        series = [title, ranking, genres, actors, runtime]
        allseries.append(series)

    return allseries  


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest ranking TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Ranking', 'Genre', 'Actors', 'Runtime'])

    for series in tvseries:
        writer.writerow(series)

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in testing / grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)