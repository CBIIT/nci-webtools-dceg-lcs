class BcratConstants:
  COMPETING_HAZARDS  = {
    "Absolute": {
      "White"   : [0.000493000000, 0.000531000000, 0.000625000000, 0.000825000000, 0.001307000000, 0.002181000000, 0.003655000000, 0.005852000000, 0.009439000000, 0.015028000000, 0.023839000000, 0.038832000000, 0.066828000000, 0.144908000000], # White
      "Black"   : [0.000743540000, 0.001016980000, 0.001459370000, 0.002159330000, 0.003150770000, 0.004487790000, 0.006322810000, 0.009630370000, 0.014718180000, 0.021163040000, 0.032660350000, 0.045640870000, 0.068351850000, 0.132712620000], # Black
      "Hispanic": [0.000437000000, 0.000533000000, 0.000700000000, 0.000897000000, 0.001163000000, 0.001702000000, 0.002646000000, 0.004216000000, 0.006960000000, 0.010867000000, 0.016858000000, 0.025156000000, 0.041866000000, 0.089476000000], # Hispanic
      "Chinese" : [0.000210649076, 0.000192644865, 0.000244435215, 0.000317895949, 0.000473261994, 0.000800271380, 0.001217480226, 0.002099836508, 0.003436889186, 0.006097405623, 0.010664526765, 0.020148678452, 0.037990796590, 0.098333900733], # Chinese
      "Japanese": [0.000173593803, 0.000295805882, 0.000228322534, 0.000363242389, 0.000590633044, 0.001086079485, 0.001859999966, 0.003216600974, 0.004719402141, 0.008535331402, 0.012433511681, 0.020230197885, 0.037725498348, 0.106149118663], # Japanese
      "Filipino": [0.000229120979, 0.000262988494, 0.000314844090, 0.000394471908, 0.000647622610, 0.001170202327, 0.001809380379, 0.002614170568, 0.004483330681, 0.007393665092, 0.012233059675, 0.021127058106, 0.037936954809, 0.085138518334], # Filipino
      "Hawaiian": [0.000563507269, 0.000369640217, 0.001019912579, 0.001234013911, 0.002098344078, 0.002982934175, 0.005402445702, 0.009591474245, 0.016315472607, 0.020152229069, 0.027354838710, 0.050446998723, 0.072262026612, 0.145844504021], # Hawaiian
      "Islander": [0.000465500812, 0.000600466920, 0.000851057138, 0.001478265376, 0.001931486788, 0.003866623959, 0.004924932309, 0.008177071806, 0.008638202890, 0.018974658371, 0.029257567105, 0.038408980974, 0.052869579345, 0.074745721133], # Other Pacific Islander
      "Asian"   : [0.000212632332, 0.000242170741, 0.000301552711, 0.000369053354, 0.000543002943, 0.000893862331, 0.001515172239, 0.002574669551, 0.004324370426, 0.007419621918, 0.013251765130, 0.022291427490, 0.041746550635, 0.087485802065]  # Other Asian
    },
    "Average":  {
      "White"   : [0.000441200000, 0.000525400000, 0.000674600000, 0.000909200000, 0.001253400000, 0.001957000000, 0.003298400000, 0.005462200000, 0.009103500000, 0.014185400000, 0.022593500000, 0.036114600000, 0.061362600000, 0.142066300000], # White
      "Black"   : [0.000743540000, 0.001016980000, 0.001459370000, 0.002159330000, 0.003150770000, 0.004487790000, 0.006322810000, 0.009630370000, 0.014718180000, 0.021163040000, 0.032660350000, 0.045640870000, 0.068351850000, 0.132712620000], # Black
      "Hispanic": [0.000437000000, 0.000533000000, 0.000700000000, 0.000897000000, 0.001163000000, 0.001702000000, 0.002646000000, 0.004216000000, 0.006960000000, 0.010867000000, 0.016858000000, 0.025156000000, 0.041866000000, 0.089476000000], # Hispanic
      "Chinese" : [0.000210649076, 0.000192644865, 0.000244435215, 0.000317895949, 0.000473261994, 0.000800271380, 0.001217480226, 0.002099836508, 0.003436889186, 0.006097405623, 0.010664526765, 0.020148678452, 0.037990796590, 0.098333900733], # Chinese
      "Japanese": [0.000173593803, 0.000295805882, 0.000228322534, 0.000363242389, 0.000590633044, 0.001086079485, 0.001859999966, 0.003216600974, 0.004719402141, 0.008535331402, 0.012433511681, 0.020230197885, 0.037725498348, 0.106149118663], # Japanese
      "Filipino": [0.000229120979, 0.000262988494, 0.000314844090, 0.000394471908, 0.000647622610, 0.001170202327, 0.001809380379, 0.002614170568, 0.004483330681, 0.007393665092, 0.012233059675, 0.021127058106, 0.037936954809, 0.085138518334], # Filipino
      "Hawaiian": [0.000563507269, 0.000369640217, 0.001019912579, 0.001234013911, 0.002098344078, 0.002982934175, 0.005402445702, 0.009591474245, 0.016315472607, 0.020152229069, 0.027354838710, 0.050446998723, 0.072262026612, 0.145844504021], # Hawaiian
      "Islander": [0.000465500812, 0.000600466920, 0.000851057138, 0.001478265376, 0.001931486788, 0.003866623959, 0.004924932309, 0.008177071806, 0.008638202890, 0.018974658371, 0.029257567105, 0.038408980974, 0.052869579345, 0.074745721133], # Other Pacific Islander
      "Asian"   : [0.000212632332, 0.000242170741, 0.000301552711, 0.000369053354, 0.000543002943, 0.000893862331, 0.001515172239, 0.002574669551, 0.004324370426, 0.007419621918, 0.013251765130, 0.022291427490, 0.041746550635, 0.087485802065]  # Other Asian
    }
  }
  CANCER_INCIDENCE = {
    "Absolute": {
      "White"   : [0.000010000000, 0.000076000000, 0.000266000000, 0.000661000000, 0.001265000000, 0.001866000000, 0.002211000000, 0.002721000000, 0.003348000000, 0.003923000000, 0.004178000000, 0.004439000000, 0.004421000000, 0.004109000000], # White
      "Black"   : [0.000026960000, 0.000112950000, 0.000310940000, 0.000676390000, 0.001194440000, 0.001873940000, 0.002415040000, 0.002911120000, 0.003101270000, 0.003665600000, 0.003931320000, 0.004089510000, 0.003967930000, 0.003637120000], # Black
      "Hispanic": [0.000020000000, 0.000071000000, 0.000197000000, 0.000438000000, 0.000811000000, 0.001307000000, 0.001574000000, 0.001857000000, 0.002151000000, 0.002512000000, 0.002846000000, 0.002757000000, 0.002523000000, 0.002039000000], # Hispanic
      "Chinese" : [0.000004059636, 0.000045944465, 0.000188279352, 0.000492930493, 0.000913603501, 0.001471537353, 0.001421275482, 0.001970946494, 0.001674745804, 0.001821581075, 0.001834477198, 0.001919911972, 0.002233371071, 0.002247315779], # Chinese
      "Japanese": [0.000000000001, 0.000099483924, 0.000287041681, 0.000545285759, 0.001152211095, 0.001859245108, 0.002606291272, 0.003221751682, 0.004006961859, 0.003521715275, 0.003593038294, 0.003589303081, 0.003538507159, 0.002051572909], # Japanese
      "Filipino": [0.000007500161, 0.000081073945, 0.000227492565, 0.000549786433, 0.001129400541, 0.001813873795, 0.002223665639, 0.002680309266, 0.002891219230, 0.002534421279, 0.002457159409, 0.002286616920, 0.001814802825, 0.001750879130], # Filipino
      "Hawaiian": [0.000045080582, 0.000098570724, 0.000339970860, 0.000852591429, 0.001668562761, 0.002552703284, 0.003321774046, 0.005373001776, 0.005237808549, 0.005581732512, 0.005677419355, 0.006513409962, 0.003889457523, 0.002949061662], # Hawaiian
      "Islander": [0.000000000001, 0.000071525212, 0.000288799028, 0.000602250698, 0.000755579402, 0.000766406354, 0.001893124938, 0.002365580107, 0.002843933070, 0.002920921732, 0.002330395655, 0.002036291235, 0.001482683983, 0.001012248203], # Other Pacific Islander
      "Asian"   : [0.000012355409, 0.000059526456, 0.000184320831, 0.000454677273, 0.000791265338, 0.001048462801, 0.001372467817, 0.001495473711, 0.001646746198, 0.001478363563, 0.001216010125, 0.001067663700, 0.001376104012, 0.000661576644]  # Other Asian
    },
    "Average":  {
      "White"   : [0.000012200000, 0.000074100000, 0.000229700000, 0.000564900000, 0.001164500000, 0.001952500000, 0.002615400000, 0.003027900000, 0.003675700000, 0.004202900000, 0.004730800000, 0.004942500000, 0.004797600000, 0.004010600000], # White
      "Black"   : [0.000026960000, 0.000112950000, 0.000310940000, 0.000676390000, 0.001194440000, 0.001873940000, 0.002415040000, 0.002911120000, 0.003101270000, 0.003665600000, 0.003931320000, 0.004089510000, 0.003967930000, 0.003637120000], # Black
      "Hispanic": [0.000020000000, 0.000071000000, 0.000197000000, 0.000438000000, 0.000811000000, 0.001307000000, 0.001574000000, 0.001857000000, 0.002151000000, 0.002512000000, 0.002846000000, 0.002757000000, 0.002523000000, 0.002039000000], # Hispanic
      "Chinese" : [0.000004059636, 0.000045944465, 0.000188279352, 0.000492930493, 0.000913603501, 0.001471537353, 0.001421275482, 0.001970946494, 0.001674745804, 0.001821581075, 0.001834477198, 0.001919911972, 0.002233371071, 0.002247315779], # Chinese
      "Japanese": [0.000000000001, 0.000099483924, 0.000287041681, 0.000545285759, 0.001152211095, 0.001859245108, 0.002606291272, 0.003221751682, 0.004006961859, 0.003521715275, 0.003593038294, 0.003589303081, 0.003538507159, 0.002051572909], # Japanese
      "Filipino": [0.000007500161, 0.000081073945, 0.000227492565, 0.000549786433, 0.001129400541, 0.001813873795, 0.002223665639, 0.002680309266, 0.002891219230, 0.002534421279, 0.002457159409, 0.002286616920, 0.001814802825, 0.001750879130], # Filipino
      "Hawaiian": [0.000045080582, 0.000098570724, 0.000339970860, 0.000852591429, 0.001668562761, 0.002552703284, 0.003321774046, 0.005373001776, 0.005237808549, 0.005581732512, 0.005677419355, 0.006513409962, 0.003889457523, 0.002949061662], # Hawaiian
      "Islander": [0.000000000001, 0.000071525212, 0.000288799028, 0.000602250698, 0.000755579402, 0.000766406354, 0.001893124938, 0.002365580107, 0.002843933070, 0.002920921732, 0.002330395655, 0.002036291235, 0.001482683983, 0.001012248203], # Other Pacific Islander
      "Asian"   : [0.000012355409, 0.000059526456, 0.000184320831, 0.000454677273, 0.000791265338, 0.001048462801, 0.001372467817, 0.001495473711, 0.001646746198, 0.001478363563, 0.001216010125, 0.001067663700, 0.001376104012, 0.000661576644]  # Other Asian
    }
  }
  COVARIANTS  = {
    #            age menarchy      # of biopsies     1st live birth    # of relatives     biopsies*>=50  1st birth*relatives
    "White"   : [0.09401030590000, 0.52926416860000, 0.21862622180000, 0.95830278450000, -0.2880424830, -0.1908113865], # White
    "Black"   : [0.26725303360000, 0.18221211310000, 0.00000000000000, 0.47572425780000, -0.1119411682,  0.0000000000], # Black
    "Hispanic": [0.09401030590000, 0.52926416860000, 0.21862622180000, 0.95830278450000, -0.2880424830, -0.1908113865], # Hispanic
    "Chinese" : [0.07499257592975, 0.55263612260619, 0.27638268294593, 0.79185633720481,  0.0000000000,  0.0000000000], # Chinese
    "Japanese": [0.07499257592975, 0.55263612260619, 0.27638268294593, 0.79185633720481,  0.0000000000,  0.0000000000], # Japanese
    "Filipino": [0.07499257592975, 0.55263612260619, 0.27638268294593, 0.79185633720481,  0.0000000000,  0.0000000000], # Filipino
    "Hawaiian": [0.07499257592975, 0.55263612260619, 0.27638268294593, 0.79185633720481,  0.0000000000,  0.0000000000], # Hawaiian
    "Islander": [0.07499257592975, 0.55263612260619, 0.27638268294593, 0.79185633720481,  0.0000000000,  0.0000000000], # Other Pacific Islander
    "Asian"   : [0.07499257592975, 0.55263612260619, 0.27638268294593, 0.79185633720481,  0.0000000000,  0.0000000000]  # Other Asian
  }
  ATTRIBUTE_RISK   = {
    "Absolute": {
      #            All Ages
      "White"   : [0.57884130000000] * 14,                          # White
      "Black"   : [0.72949880000000] * 6 + [0.74397137000000] * 8,                          # Black
      "Hispanic": [0.57884130000000] * 14,                          # Hispanic
      #            < 50                     >= 50
      "Chinese" : [0.47519806426735] * 6 + [0.50316401683903] * 8,  # Chinese
      "Japanese": [0.47519806426735] * 6 + [0.50316401683903] * 8,  # Japanese
      "Filipino": [0.47519806426735] * 6 + [0.50316401683903] * 8,  # Filipino
      "Hawaiian": [0.47519806426735] * 6 + [0.50316401683903] * 8,  # Hawaiian
      "Islander": [0.47519806426735] * 6 + [0.50316401683903] * 8,  # Other Pacific Islander
      "Asian"   : [0.47519806426735] * 6 + [0.50316401683903] * 8   # Other Asian
    },
    "Average": {
      #            All Ages
      "White"   : [1.0] * 14, # White
      "Black"   : [1.0] * 14, # Black
      "Hispanic": [1.0] * 14, # Hispanic
      "Chinese" : [1.0] * 14, # Chinese
      "Japanese": [1.0] * 14, # Japanese
      "Filipino": [1.0] * 14, # Filipino
      "Hawaiian": [1.0] * 14, # Hawaiian
      "Islander": [1.0] * 14, # Other Pacific Islander
      "Asian"   : [1.0] * 14  # Other Asian
    }
  }
