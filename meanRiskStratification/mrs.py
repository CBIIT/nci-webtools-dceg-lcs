# We need to import the jsonify object, it will let us
# output json, and it will take care of the right string
# data conversion, the headers for the response, etc
import os
import re
import time
import json
from flask import Flask, render_template, request, jsonify
from rpy2.robjects.packages import SignatureTranslatedAnonymousPackage
from rpy2.robjects.vectors import IntVector, FloatVector
from socket import gethostname

with open ('MRSunconditionalToolWrapper.R') as fh:
        rcode = os.linesep.join(fh.readlines())
        wrapper = SignatureTranslatedAnonymousPackage(rcode,"wrapper")

# Initialize the Flask application
app = Flask(__name__)

@app.route('/')
def index():
    # Render template
    return render_template('index.html')

# This route will return a list in JSON format
@app.route('/mrsRest/', methods=['POST'])
def mrsRest():
    # Get the parsed contents of the form data
	
    data = request.json

    biomar = []
    
    for currData in data:


	    if data[currData]['option'] == 1:

		    a = data[currData]['a']
		    b = data[currData]['b']
		    c = data[currData]['c']
		    d = data[currData]['d']

		    abcd = []
		    abcd.append(a)
		    abcd.append(b)
		    abcd.append(c)
		    abcd.append(d)
		    
		    fromR = wrapper.getJSON_abcd(IntVector(abcd))

		    return json.dumps(str(fromR)) 

	    elif data[currData]['option'] == 2:

		    ppv = data[currData]['ppv']
		    npv = data[currData]['npv']
		    sens = data[currData]['sens']
		    spec = data[currData]['spec']
		    probM = data[currData]['probM']
		    probD = data[currData]['probD']
		    total = data[currData]['sampsize']

		    if ppv is not None:

			    if probM is not None:
				    fromR = wrapper.getJSON_PPVNPVprobM(ppv,npv,probM,total)
				    return json.dumps(str(fromR))
#				    biomar.append(wrapper.getJSON_PPVNPVprobM(ppv,npv,probM,total))

			    elif probD is not None:
				    fromR = wrapper.getJSON_PPVNPVprobD(ppv,npv,probD,total)
				    return json.dumps(str(fromR))
#				    biomar.append(wrapper.getJSON_PPVNPVprobD(ppv,npv,probD,total))

		    elif sens is not None:

			    if probM is not None:
				    fromR = wrapper.getJSON_sensspecprobM(sens,spec,probM,total)
				    return json.dumps(str(fromR))
#				    biomar.append(wrapper.getJSON_sensspecprobM(sens,spec,probM,total))

			    elif probD is not None:
				    fromR = wrapper.getJSON_sensspecprobD(sens,spec,probD,total)
				    return json.dumps(str(fromR))
#				    biomar.append(wrapper.getJSON_sensspecprobD(sens,spec,probD,total))

  

    #jsonlist=list(jsonrtn)

    #2
    #jsonstring=''.join(jsonlist)
    #print jsonstring
    return biomar[0] 
    

    #1print "--------------------------------------------------"
    #1print json.dumps(jsonlist)
    #1print "--------------------------------------------------"

    #1renderjson = json.dumps(jsonlist)
    #1return renderjson
 
#TEST DATA
    #with open ("testjson3.txt", "r") as myfile:
    #	testjson=myfile.read().replace('\n', '')

    #return testjson


import argparse
if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("-p", dest="port_number", default="9982", help="Sets the Port")
    # Default port is production value; prod,stage,dev = 9982, sandbox=9983
    args = parser.parse_args()
    port_num = int(args.port_number);

    hostname = gethostname()
    app.run(host='0.0.0.0', port=port_num, debug = True)
