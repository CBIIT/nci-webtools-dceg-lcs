// definitions used for display
var definitionObj = {
    prob_m: {
        term: "Marker Positivity (M+)",
        definition: "Positive test result for biomarker"
    },
    m_neg: {
        term: "Marker Negativity (M-)",
        definition: "Negative test result for biomarker test"
    },
    prob_d: {
        term: "Disease Positive (D+)",
        definition: "Has disease"
    },
    d_neg: {
        term: "Disease Negative (D-)",
        definition: "Does not have disease"
    },
    concern: {
        term: "Danger",
        definition: "Increase in disease risk from testing positive. Formula: Danger d=PPV-q"
    },
    reassurance: {
        term: "Reassurance",
        definition: "Reduction in disease risk from testing negative. Formula: Reassurance r=q-cNPV"
    },
    pbs: {
        term: "Population Burden Stratification",
        definition: "Extra disease detection in positive group than negative group. " +
        "Formula: Population Burden Stratification =P(D,M+)-P(D,M-)"
    },
    nns: {
        term: "Number Needed to Screen",
        definition: "Definition for number needed to screen. Formula: Usual NNS = 1/t"
    },
    nnr: {
        term: "Number Needed to Recruit",
        definition: "To detect 1 more disease case in positive group than negative group. Formula: NNR=1/T+"
    },
    max_mrs: {
        term: "Maximum possible MRS for a disease with this prevalence",
        definition: "Maximum possible MRS for a disease with this prevalence. Formula: max risk strat=2q(1-q)"
    },
    q_spec: {
        term: "Quality of the specificity",
        definition: "Increase in specificity versus a random test, fixing test positivity"
    },
    q_sens: {
        term: "Quality of the sensitivity",
        definition: "Increase in sensitivity versus a random test, fixing test positivity. Formula: Danger*=ybar=sens-p"
    },
    spec: {
        term: "Specificity",
        definition: "Specificity is the proportion whose biomarker test is negative (below the threshold) among" +
        " those without disease. Formula: Reassurance*=xbar=spec-(1-p)"
    },
    sens: {
        term: "Sensitivity",
        definition: "Sensitivity is the proportion whose biomarker test is positive (above the threshold) among " +
        "those who are positive for disease."
    },
    ppv: {
        term: "Positive Predictive Value (PPV)",
        definition: "Probability of disease, given a positive test result from biomarker.  Unlike sensitivity " +
        "and specificity, PPV's reflect disease prevalence and is useful for risk stratification."
    },
    npv: {
        term: "Negative Predictive Value (NPV)",
        definition: "Definition for NPV"
    },
    mrs:{
        term: "Mean Risk Stratification (MRS)",
        definition: "Average change in pretest-posttest disease risk. Formula: MRS=2tp(1-p)"
    },
    sampsize:{term:"Sample Size",definition:""},
    test:{term:"Test",definition:"empty"}
};