/*
 * Kim de Bie, 11077379
 * Mapping inequality using D3 and the Gini Index.
 */

// the data
var giniData = [{"country": "AFG", "gini": "NA"}, {"country": "ALB", "gini": "28.96"}, {"country": "DZA", "gini": "NA"}, {"country": "ASM", "gini": "NA"}, {"country": "ADO", "gini": "NA"}, {"country": "AGO", "gini": "42.72"}, {"country": "ATG", "gini": "NA"}, {"country": "ARG", "gini": "42.28"}, {"country": "ARM", "gini": "31.54"}, {"country": "ABW", "gini": "NA"}, {"country": "AUS", "gini": "NA"}, {"country": "AUT", "gini": "30.48"}, {"country": "AZE", "gini": "NA"}, {"country": "BHS", "gini": "NA"}, {"country": "BHR", "gini": "NA"}, {"country": "BGD", "gini": "31.98"}, {"country": "BRB", "gini": "NA"}, {"country": "BLR", "gini": "26.01"}, {"country": "BEL", "gini": "27.59"}, {"country": "BLZ", "gini": "NA"}, {"country": "BEN", "gini": "43.44"}, {"country": "BMU", "gini": "NA"}, {"country": "BTN", "gini": "38.65"}, {"country": "BOL", "gini": "48.06"}, {"country": "BIH", "gini": "NA"}, {"country": "BWA", "gini": "60.46"}, {"country": "BRA", "gini": "52.87"}, {"country": "BRN", "gini": "NA"}, {"country": "BGR", "gini": "36.01"}, {"country": "BFA", "gini": "NA"}, {"country": "BDI", "gini": "33.36"}, {"country": "CPV", "gini": "47.19"}, {"country": "KHM", "gini": "30.76"}, {"country": "CMR", "gini": "42.82"}, {"country": "CAN", "gini": "33.68"}, {"country": "CYM", "gini": "NA"}, {"country": "CAF", "gini": "56.24"}, {"country": "TCD", "gini": "43.32"}, {"country": "CHI", "gini": "NA"}, {"country": "CHL", "gini": "50.45"}, {"country": "CHN", "gini": "42.06"}, {"country": "COL", "gini": "53.49"}, {"country": "COM", "gini": "NA"}, {"country": "ZAR", "gini": "42.1"}, {"country": "COG", "gini": "40.16"}, {"country": "CRI", "gini": "49.18"}, {"country": "CIV", "gini": "43.18"}, {"country": "HRV", "gini": "31.98"}, {"country": "CUB", "gini": "NA"}, {"country": "CUW", "gini": "NA"}, {"country": "CYP", "gini": "34.31"}, {"country": "CZE", "gini": "26.13"}, {"country": "DNK", "gini": "29.08"}, {"country": "DJI", "gini": "45.13"}, {"country": "DMA", "gini": "NA"}, {"country": "DOM", "gini": "47.07"}, {"country": "ECU", "gini": "47.29"}, {"country": "EGY", "gini": "30.75"}, {"country": "SLV", "gini": "43.51"}, {"country": "GNQ", "gini": "NA"}, {"country": "ERI", "gini": "NA"}, {"country": "EST", "gini": "33.15"}, {"country": "ETH", "gini": "NA"}, {"country": "FRO", "gini": "NA"}, {"country": "FJI", "gini": "42.78"}, {"country": "FIN", "gini": "27.12"}, {"country": "FRA", "gini": "33.1"}, {"country": "PYF", "gini": "NA"}, {"country": "GAB", "gini": "NA"}, {"country": "GMB", "gini": "NA"}, {"country": "GEO", "gini": "40.03"}, {"country": "DEU", "gini": "30.13"}, {"country": "GHA", "gini": "NA"}, {"country": "GRC", "gini": "36.68"}, {"country": "GRL", "gini": "NA"}, {"country": "GRD", "gini": "NA"}, {"country": "GUM", "gini": "NA"}, {"country": "GTM", "gini": "52.35"}, {"country": "GIN", "gini": "33.73"}, {"country": "GNB", "gini": "50.66"}, {"country": "GUY", "gini": "NA"}, {"country": "HTI", "gini": "60.79"}, {"country": "HND", "gini": "53.67"}, {"country": "HKG", "gini": "NA"}, {"country": "HUN", "gini": "30.55"}, {"country": "ISL", "gini": "26.94"}, {"country": "IND", "gini": "33.9"}, {"country": "IDN", "gini": "35.57"}, {"country": "IRN", "gini": "37.35"}, {"country": "IRQ", "gini": "29.54"}, {"country": "IRL", "gini": "32.52"}, {"country": "IMY", "gini": "NA"}, {"country": "ISR", "gini": "42.78"}, {"country": "ITA", "gini": "35.16"}, {"country": "JAM", "gini": "41.11"}, {"country": "JPN", "gini": "32.11"}, {"country": "JOR", "gini": "32.57"}, {"country": "KAZ", "gini": "26.35"}, {"country": "KEN", "gini": "NA"}, {"country": "KIR", "gini": "37.61"}, {"country": "PRK", "gini": "NA"}, {"country": "KOR", "gini": "NA"}, {"country": "KSV", "gini": "26.71"}, {"country": "KWT", "gini": "NA"}, {"country": "KGZ", "gini": "27.37"}, {"country": "LAO", "gini": "37.89"}, {"country": "LVA", "gini": "35.48"}, {"country": "LBN", "gini": "NA"}, {"country": "LSO", "gini": "54.18"}, {"country": "LBR", "gini": "36.48"}, {"country": "LBY", "gini": "NA"}, {"country": "LIE", "gini": "NA"}, {"country": "LTU", "gini": "35.15"}, {"country": "LUX", "gini": "34.79"}, {"country": "MAC", "gini": "NA"}, {"country": "MKD", "gini": "44.05"}, {"country": "MDG", "gini": "40.63"}, {"country": "MWI", "gini": "46.12"}, {"country": "MYS", "gini": "46.26"}, {"country": "MDV", "gini": "36.78"}, {"country": "MLI", "gini": "33.04"}, {"country": "MLT", "gini": "NA"}, {"country": "MHL", "gini": "NA"}, {"country": "MRT", "gini": "37.48"}, {"country": "MUS", "gini": "35.84"}, {"country": "MEX", "gini": "48.07"}, {"country": "FSM", "gini": "61.18"}, {"country": "MDA", "gini": "28.53"}, {"country": "MCO", "gini": "NA"}, {"country": "MNG", "gini": "33.75"}, {"country": "MNE", "gini": "33.19"}, {"country": "MAR", "gini": "40.72"}, {"country": "MOZ", "gini": "45.58"}, {"country": "MMR", "gini": "NA"}, {"country": "NAM", "gini": "60.97"}, {"country": "NPL", "gini": "32.75"}, {"country": "NLD", "gini": "27.99"}, {"country": "NCL", "gini": "NA"}, {"country": "NZL", "gini": "NA"}, {"country": "NIC", "gini": "45.73"}, {"country": "NER", "gini": "31.45"}, {"country": "NGA", "gini": "42.97"}, {"country": "MNP", "gini": "NA"}, {"country": "NOR", "gini": "25.9"}, {"country": "OMN", "gini": "NA"}, {"country": "PAK", "gini": "29.59"}, {"country": "PLW", "gini": "NA"}, {"country": "PAN", "gini": "51.67"}, {"country": "PNG", "gini": "43.88"}, {"country": "PRY", "gini": "48.3"}, {"country": "PER", "gini": "44.73"}, {"country": "PHL", "gini": "43.04"}, {"country": "POL", "gini": "32.39"}, {"country": "PRT", "gini": "36.04"}, {"country": "PRI", "gini": "NA"}, {"country": "QAT", "gini": "NA"}, {"country": "ROM", "gini": "27.33"}, {"country": "RUS", "gini": "41.59"}, {"country": "RWA", "gini": "51.34"}, {"country": "WSM", "gini": "42.69"}, {"country": "SMR", "gini": "NA"}, {"country": "STP", "gini": "30.82"}, {"country": "SAU", "gini": "NA"}, {"country": "SEN", "gini": "40.28"}, {"country": "SRB", "gini": "29.65"}, {"country": "SYC", "gini": "42.77"}, {"country": "SLE", "gini": "33.99"}, {"country": "SGP", "gini": "NA"}, {"country": "SXM", "gini": "NA"}, {"country": "SVK", "gini": "26.12"}, {"country": "SVN", "gini": "25.59"}, {"country": "SLB", "gini": "NA"}, {"country": "SOM", "gini": "NA"}, {"country": "ZAF", "gini": "63.38"}, {"country": "SSD", "gini": "NA"}, {"country": "ESP", "gini": "35.89"}, {"country": "LKA", "gini": "38.58"}, {"country": "KNA", "gini": "NA"}, {"country": "LCA", "gini": "NA"}, {"country": "MAF", "gini": "NA"}, {"country": "VCT", "gini": "NA"}, {"country": "SDN", "gini": "35.39"}, {"country": "SUR", "gini": "NA"}, {"country": "SWZ", "gini": "51.45"}, {"country": "SWE", "gini": "27.32"}, {"country": "CHE", "gini": "31.64"}, {"country": "SYR", "gini": "NA"}, {"country": "TJK", "gini": "30.77"}, {"country": "TZA", "gini": "37.78"}, {"country": "THA", "gini": "39.26"}, {"country": "TMP", "gini": "31.56"}, {"country": "TGO", "gini": "46.02"}, {"country": "TON", "gini": "38.1"}, {"country": "TTO", "gini": "NA"}, {"country": "TUN", "gini": "35.81"}, {"country": "TUR", "gini": "40.17"}, {"country": "TKM", "gini": "NA"}, {"country": "TCA", "gini": "NA"}, {"country": "TUV", "gini": "NA"}, {"country": "UGA", "gini": "42.37"}, {"country": "UKR", "gini": "24.55"}, {"country": "ARE", "gini": "NA"}, {"country": "GBR", "gini": "32.57"}, {"country": "USA", "gini": "41.06"}, {"country": "URY", "gini": "41.87"}, {"country": "UZB", "gini": "36.1"}, {"country": "VUT", "gini": "37.18"}, {"country": "VEN", "gini": "46.94"}, {"country": "VNM", "gini": "38.7"}, {"country": "VIR", "gini": "NA"}, {"country": "WBG", "gini": "34.46"}, {"country": "YEM", "gini": "NA"}, {"country": "ZMB", "gini": "55.62"}, {"country": "ZWE", "gini": "NA"}]  

// function to determine color
function determineColor(gini){
  if (gini < 30) {
    return "#fee5d9";
  } else if (gini < 40) {
    return "#fcae91";
  }   else if (gini < 50) {
    return "#fb6a4a";
  } else if (gini < 60) {
    return "#de2d26";
  } else if (gini < 70) {
    return "#a50f15";
  } else {
    return "#cccccc";
  };
};

// create dataset in correct format
var dataset = {}

giniData.forEach(function(country){
  dataset[country["country"]] = {giniScore: country["gini"], fillColor: determineColor(country["gini"]) };
});


// setting the map
var map = new Datamap({
  element: document.getElementById('worldmap'),
  projection: 'mercator',
  fills: {
    defaultFill: '#CDCCCC',
  },
  data: dataset,
  geographyConfig: {
    highlightFillColor: '#fdbb84',
    highlightBorderColor: '#fc8d59',
    highlightBorderWidth: 1,    
    popupTemplate: function(geo, data) {
      return ['<div class="hoverinfo"><strong>',
      'Gini Index for ' + geo.properties.name,
      ': ' + data.giniScore,
      '</strong></div>'].join('');
    }
  }
});