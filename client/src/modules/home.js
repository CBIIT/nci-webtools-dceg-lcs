import Container from "react-bootstrap/Container";
import Card from 'react-bootstrap/Card';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import { useState, useEffect } from "react";
import {
    defaultFormState,
    resultsState
} from "../states/state";
import { useRecoilState } from "recoil";
import { postJSON } from "../components/query";
import { LoadingOverlay } from '@cbiitss/react-components';
import { useHistory } from 'react-router-dom'

export default function Home() {
    const [form, setForm] = useState(defaultFormState);
    const mergeForm = (obj) => setForm({ ...form, ...obj });
    const [results, setResults] = useRecoilState(resultsState);
    const history = useHistory()

    const bmiHigh = 50
    const bmiLow = 15
    const defaultRace = 0
    const defaultEdu = 2

    async function handleSubmit() {
        setResults({ loading: true })

        var bmi = form.bmi;
        if (form.bmi < bmiLow)
            bmi = bmiLow
        else if (form.bmi > bmiHigh)
            bmi = bmiHigh

        const qtYears = form.smoker_type.value === 'former' ? Math.round(form.age.value - form.end) : 0

        var race = parseInt(form.race_group.value, 10);
        if (form.race_group.value === 4 || form.race_group.value === 5)
            race = defaultRace

        var edu = parseInt(form.education.value, 10);
        if (form.education.value === 7)
            edu = defaultEdu

        var smokeYears;
        if (form.smoker_type.value === 'current')
            smokeYears = form.age.value - form.start.value

        if (form.smoker_type.value === 'former')
            smokeYears = form.end - form.start.value

        const params = {
            'age': form.age.value,
            'bmi': Math.round(bmi * 100) / 100,
            'realBmi': Math.round(form.bmi * 100) / 100,
            'cpd': parseFloat(form.cigs),
            'emp': parseInt(form.disease.value, 10),
            'fam.lung.trend': parseInt(form.history.value, 10),
            'gender': parseInt(form.gender.value, 10),
            'qtyears': qtYears,
            'smkyears': smokeYears,
            'race': race,
            'edu6': edu,
            'pkyr.cat': Math.round(form.packYears * 100) / 100,
        }

        await postJSON('/lungCancerRest/', params).then((response) => {

            
            for (var i = 0; i <= 5; i++) {
                response[i] = Math.round(response[i])
            }

            if(response[0] > response[2]){
                response[2] = response[0]
            }

            setResults({ ...form, results: response, unstable: (response[0] > response[2] ? true : false), loading: false })
            history.push('/results')
        })

    }

    function handleChange(name, event) {
        console.log(event)
        mergeForm({ [name]: event });
    }

    console.log(results)

    const numRange = (min, max) => {
        var list = []
        for (var i = min; i <= max; i++) {
            list = list.concat({ value: i, label: i })
        }
        return list
    }

    const feetInchesValid = () => {
        const { feet, inches } = form;

        if (feet !== '' && inches !== '') {

            if (feet <= 0 || feet > 10)
                return false

            if (inches < 0 || inches >= 12)
                return false
        }

        return true
    }

    const calculateBMI = (event) => {

        const { units, feet, inches, cm, kg, pounds } = { ...form, [event.target.name]: event.target.value };

        if (units.value === 'us' && feet && inches && pounds) {
            const totalInches = feet * 12 + inches
            const calcBMI = (pounds / Math.pow(totalInches, 2)) * 703
            return calcBMI
        }

        if (units.value === 'metric' && cm && kg) {
            const calcBMI = kg / Math.pow(cm / 100, 2)
            return calcBMI
        }
        return ''
    }

    const calculatePackYears = (event) => {
        const { smoker_type, age, start, end, cigs } = { ...form, [event.name]: event.value };
        console.log({ smoker_type, age, start, end, cigs })

        if (smoker_type.value === 'current' && age.value && start.value && cigs) {
            return ((age.value - start.value) * (cigs / 20))
        }
        if (smoker_type.value === 'former' && end && start.value && cigs) {
            return ((end - start.value) * (cigs / 20))
        }

        return ''
    }

    function isValid() {

        if (form.bmiSelection.value === 'bmi' && !form.bmi)
            return false

        if (form.bmiSelection.value === 'hw') {

            if (form.units.value === 'us' && (!form.feet || !form.inches || !form.pounds || !feetInchesValid()))
                return false

            if (form.units.value === 'metric' && (!form.cm || !form.kg || form.cm < 30.48))
                return false
        }

        if (form.smoker_type.value === 'current' || form.smoker_type.value === 'former') {

            if (!form.age || !form.start || !form.cigs)
                return false

            if (form.age.value < form.start.value || form.start.value < 0)
                return false

            if (form.smoker_type.value === 'former' && (!form.end || (form.end < form.start.value || form.end > form.age.value))) {
                return false
            }
        }

        if (form.smoker_type.value === 'non')
            return false

        return form.gender && form.race_group && form.education && form.history && form.disease
    }

    return (

        <Container className="my-4">
            <LoadingOverlay active={results.loading} overlayStyle={{ position: 'fixed' }} />
            <div className="col-xl-12">
                <p>
                    This tool uses basic information on smoking behavior and data from the National Lung Cancer Screening Trial (NLST) to determine the following:
                </p>
                <ul>
                    <li>whether someone like you would be recommended to get lung cancer screening by the <a href="https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/lung-cancer-screening" target="_blank">US Preventative Services Task Force</a> (a group of experts who make recommendations about prevention);</li>
                    <li>your chance of getting a lung cancer diagnosis in the next five years</li>
                    <li>your chance of dying from lung cancer in the next five years;</li>
                    <li>your risk of a <a href="https://www.cancer.gov/publications/dictionaries/cancer-terms/def/false-positive-test-result" target="_blank">false-positive test result</a> (a screening test result that indicates that a person has a specific disease or condition when the person actually does not have the disease or condition).</li>
                </ul>
                <p className="text-bold">
                    The best way to lower your risk of lung cancer, and all smoking related diseases, is to quit smoking. Learn more by visiting <a target="_blank" href="https://smokefree.gov/" class='font-weight-bold'>smokefree.gov</a>, the CDC <a target="_blank" href="https://www.cdc.gov/tobacco/quit_smoking/">quitting smoking</a> page, or by calling 1-800-QUIT-NOW.
                </p>
            </div>
            <Card>
                <Card.Header className="bg-primary text-light">Risk Tool</Card.Header>
                <Card.Body>
                    <p className='text-bold'>
                        This risk tool is not designed for use by (1) individuals younger than 55 or older than 80, (2) never-smokers, (3) current smokers who have smoked less than 30 <a target="_blank" href='https://www.cancer.gov/publications/dictionaries/cancer-terms/def/pack-year'>pack-years</a> (e.g. those who smoked 1 pack per day for 30 years or 2 packs per day for 15 years), or (3) former smokers who quit more than 15 years ago.
                    </p>
                    <Form.Group className='row mb-3' controlId='age'>
                        <Form.Label className="col-md-4">Age</Form.Label>
                        <div className="row col-md-4">
                            <Select
                                name='age'
                                placeholder='Select...'
                                options={numRange(50, 80)}
                                value={form.age}
                                onChange={(event) => setForm({ ...form, age: event, packYears: calculatePackYears({ name: 'age', value: { value: event.value, label: event.value } }) })}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className='row mb-3' controlId='gender'>
                        <Form.Label className="col-md-4">Gender</Form.Label>
                        <div className="row col-md-4">
                            <Select
                                name='gender'
                                placeholder='Select...'
                                value={form.gender}
                                onChange={(event) => handleChange('gender', event)}
                                options={[
                                    { value: '0', label: 'Male' },
                                    { value: '1', label: 'Female' }
                                ]}

                            />
                        </div>
                    </Form.Group>

                    <Form.Group className='row mb-3' controlId='bmiSelection'>
                        <Form.Label className="col-md-4">Height and weight, or body mass index (BMI)</Form.Label>
                        <div className="row col-md-4">
                            <Select
                                name='bmiSelection'
                                placeholder='Select...'
                                value={form.bmiSelection}
                                onChange={(event) => setForm({ ...form, bmiSelection: event, bmi: '', feet: '', inches: '', pounds: '', kg: '' })}
                                options={[
                                    { value: 'bmi', label: 'BMI' },
                                    { value: 'hw', label: 'Height and Weight' },
                                    { value: 'unknown', label: 'Unknown' }
                                ]}

                            />
                        </div>
                    </Form.Group>

                    {form.bmiSelection.value === 'bmi' && <Form.Group className='row mb-3' controlId='bmi'>
                        <Form.Label className="col-md-4">BMI</Form.Label>
                        <div className="row px-4 col-md-4">
                            <input
                                name='bmi'
                                type='number'
                                value={form.bmi}
                                className="form-control no-spinner"
                                onChange={(event) => handleChange('bmi', Number(event.target.value))}
                            />

                        </div>


                    </Form.Group>}

                    {form.bmiSelection.value === 'hw' && <Form.Group className='row mb-3 ' controlId='units'>
                        <Form.Label className="col-md-4">Units for entering height and weight</Form.Label>
                        <div className="row col-md-4">
                            <Select
                                name='units'
                                value={form.units}
                                onChange={(event) => setForm({ ...form, units: event, bmi: '', feet: '', inches: '', pounds: '', kg: '' })}
                                options={[
                                    { value: 'metric', label: 'Metric (e.g., 175 cm or 60 kg' },
                                    { value: 'us', label: 'US (e.g., 5 feet 9 inches or 115 pounds)' },
                                ]}
                            />
                        </div>
                    </Form.Group>}

                    {form.bmiSelection.value === 'hw' && <Form.Group className='row mb-3' controlId='height'>
                        <Form.Label className="col-md-4">Height?</Form.Label>
                        {form.bmiSelection.value === 'hw' && form.units.value === 'us' &&
                            <div className='row col-md-4'>
                                <div className="col-md-6">
                                    <input
                                        name='feet'
                                        type='number'
                                        className="form-control no-spinner"
                                        onBlur={(event) => setForm({ ...form, feet: Number(event.target.value), bmi: calculateBMI(event) })}
                                        style={{ borderColor: `${!feetInchesValid() ? 'red' : ''}` }}
                                    />
                                    <label for='feet'>Feet</label>
                                </div>
                                <div className="col-md-6">
                                    <input
                                        name='inches'
                                        type='number'
                                        className="form-control no-spinner"
                                        onBlur={(event) => setForm({ ...form, inches: Number(event.target.value), bmi: calculateBMI(event) })}
                                        style={{ borderColor: `${!feetInchesValid() ? 'red' : ''}` }}
                                    />
                                    <label for='inches'>Inch(es)</label>
                                </div>
                            </div>}
                        {form.bmiSelection.value === 'hw' && form.units.value === 'us' && !feetInchesValid() && <div className="mt-3" style={{ color: 'red' }}>
                            <div>Please ensure, that feet are greater than 0 and less than or equal to 10, and inches are greater than or equal to 0 and less than 12.</div>
                            <div>Please ensure that the height values above do not include any non-numeric characters.</div>
                        </div>}

                        {form.bmiSelection.value === 'hw' && form.units.value === 'metric' && <div className='row px-4 col-md-4'>
                            <input
                                name='cm'
                                type='number'
                                className="form-control no-spinner"
                                onBlur={(event) => setForm({ ...form, cm: Number(event.target.value), bmi: calculateBMI(event) })}
                                style={{ borderColor: `${(form.cm !== '' && form.cm < 30.48) ? 'red' : ''}` }}
                            />
                            <label for='cm'>Centimeter(s)</label>
                        </div>}

                        {form.bmiSelection.value === 'hw' && form.units.value === 'metric' && (form.cm !== '' && form.cm < 30.48) && <div className="my-3" style={{ color: 'red' }}>
                            <div>Please ensure, that centimeters are greater than 30.48. Please ensure that the value above does not include any non-numeric characters.</div>
                        </div>}
                    </Form.Group>}
                    {form.bmiSelection.value === 'hw' && <Form.Group className='row mb-3' controlId='weight'>
                        <Form.Label className="col-md-4">Weight?</Form.Label>
                        {form.bmiSelection.value === 'hw' && form.units.value === 'us' && <div className='row px-4 col-md-4'>
                            <input
                                name='pounds'
                                type='number'
                                disabled={!feetInchesValid()}
                                className="form-control no-spinner"
                                onBlur={(event) => setForm({ ...form, pounds: Number(event.target.value), bmi: calculateBMI(event) })}
                            />
                            <label for='pounds'>Pound(s)</label>
                        </div>}

                        {form.bmiSelection.value === 'hw' && form.units.value === 'metric' && <div className='row px-4 col-md-4'>
                            <input
                                name='kg'
                                type='number'
                                className="form-control no-spinner"
                                disabled={form.cm !== '' && form.cm < 30.48}
                                onBlur={(event) => setForm({ ...form, kg: Number(event.target.value), bmi: calculateBMI(event) })}
                            />
                            <label for='kg'>Kilogram(s)</label>

                        </div>}

                    </Form.Group>}

                    {form.bmi && (form.bmi > bmiHigh) && <div className='mt-3' style={{ color: 'red' }}>
                        Your BMI is greater than 50, the following risks are calculated based on BMI=50.
                    </div>}

                    {form.bmi && (form.bmi < bmiLow) && <div className='mb-3' style={{ color: 'red' }}>
                        Your BMI is less than 15, the following risks are calculated based on BMI=15.
                    </div>}

                    <Form.Group className='row mb-3' controlId='race_group'>
                        <Form.Label className="col-md-4">Racial or ethnic group:</Form.Label>
                        <div className="row col-md-4">
                            <Select
                                name='race_group'
                                placeholder='Select...'
                                value={form.race_group}
                                onChange={(event) => handleChange('race_group', event)}
                                options={[
                                    { value: '0', label: 'White' },
                                    { value: '1', label: 'Black or African-American' },
                                    { value: '2', label: 'Hispanic' },
                                    { value: '3', label: 'Asian or Pacific Islander' },
                                    { value: '4', label: 'Other' },
                                    { value: '5', label: 'Unknown' },
                                ]}
                            />
                        </div>
                    </Form.Group>
                    <Form.Group className='row mb-3' controlId='education'>
                        <Form.Label className="col-md-4">Highest level of education obtained:</Form.Label>
                        <div className="row col-md-4">
                            <Select
                                name='education'
                                placeholder='Select...'
                                value={form.education}
                                onChange={(event) => handleChange('education', event)}
                                options={[
                                    { value: '0', label: 'Less than high school' },
                                    { value: '1', label: 'High school, but did not graduate' },
                                    { value: '2', label: 'High school graduate' },
                                    { value: '3', label: 'Vocation/technical school, but no college' },
                                    { value: '4', label: 'Associate Degree or some college' },
                                    { value: '5', label: 'Bachelors (college) degree' },
                                    { value: '6', label: 'Graduate degree' },
                                    { value: '7', label: 'Unknown' },
                                ]}
                            />
                        </div>
                    </Form.Group>
                    <Form.Group className='row mb-3' controlId='smoker_type'>
                        <Form.Label className="col-md-4">Type of smoker?</Form.Label>
                        <div className="row col-md-4">
                            <Select
                                name='smoker_type'
                                placeholder='Select...'
                                value={form.smoker_type}
                                onChange={(event) => {
                                    setForm({ ...form, smoker_type: event, start: '', end: '', packYears: '' })
                                }}
                                options={[
                                    { value: 'current', label: 'Current smoker' },
                                    { value: 'former', label: 'Former smoker' },
                                    { value: 'non', label: 'Non smoker' },
                                ]}
                            />
                        </div>
                    </Form.Group>

                    {form.smoker_type.value === 'non' && <div className='mb-3' style={{ color: 'red' }}>
                        You are <a target="_blank" href='https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/lung-cancer-screening'>NOT recommended</a> to get screened because you are not a smoker. This tool cannot provide risk estimates for non-smokers.
                    </div>}

                    {(form.smoker_type.value === 'current' || form.smoker_type.value === 'former') && <div>
                        <Form.Group className='row mb-3' controlId='start'>
                            <div className='col-md-2'></div>
                            <Form.Label className="col-md-2" style={{ justifyContent: 'flex-end', color: `${form.age.value < form.start.value && form.start.value > 0 ? 'red' : ''}` }}>How old were you when you started smoking?</Form.Label>
                            <div className="row col-md-4">
                                <Select
                                    name='start'
                                    placeholder='Select...'
                                    value={form.start}
                                    options={numRange(1, form.age.value)}
                                    onChange={(event) => setForm({ ...form, start: event, packYears: calculatePackYears({ name: 'start', value: event.value }) })}
                                />
                            </div>
                        </Form.Group>

                        {(form.age.value < form.start.value || form.start.value <= 0) && <div className="mb-3" style={{ color: 'red' }}>
                            Please ensure that the starting age is greater than 0 and less than or equal to age.
                        </div>}

                        {form.smoker_type.value === 'former' && <Form.Group className='row mb-3' controlId='end'>
                            <div className='col-md-2'></div>
                            <Form.Label className="col-md-2" style={{ justifyContent: 'flex-end', color: `${form.smoker_type.value === 'former' && form.end && (form.end < form.start.value || form.end > form.age.value) && form.start.value > 0 ? 'red' : ''}` }}>How old were you when you quit successfully</Form.Label>
                            <div className="row px-4 col-md-4">
                                <input
                                    name='end'
                                    type='number'
                                    className="form-control no-spinner"
                                    onBlur={(event) => setForm({ ...form, end: Number(event.target.value), packYears: calculatePackYears({ name: 'end', value: Number(event.target.value) }) })}
                                    style={{ height: '2.25em' }}
                                />
                            </div>
                        </Form.Group>}

                        {form.smoker_type.value === 'former' && form.end && (form.end < form.start.value || form.end > form.age.value) && <div className="mb-3" style={{ color: 'red' }}>
                            Please ensure that the quitting age value is less than age and greater than or equal to starting age.
                        </div>}

                        <Form.Group className='row mb-3' controlId='cigs'>
                            <div className='col-md-2'></div>
                            {form.smoker_type.value === 'current' && <Form.Label className="col-md-2">On a typical day, how many cigarettes do you smoke?</Form.Label>}
                            {form.smoker_type.value === 'former' && <Form.Label className="col-md-2">Before you successfully quit, on a typical day, how many cigarettes did you smoke?</Form.Label>}
                            <div className="row px-4 col-md-4">
                                <input
                                    name='cigs'
                                    type='number'
                                    className="form-control no-spinner"
                                    onBlur={(event) => setForm({ ...form, cigs: Number(event.target.value), packYears: calculatePackYears({ name: 'cigs', value: Number(event.target.value) }) })}
                                    style={{ height: '2.25em' }}
                                />
                            </div>
                        </Form.Group>

                        {form.packYears !== '' && (form.packYears < 10 || form.packYears > 70) && <div className="mb-3" style={{ color: 'red' }}>
                            Number of pack-years is outside the range of 10 - 70. Please be sure you have entered smoking history and age correctly.
                        </div>}
                    </div>}

                    <Form.Group className='row mb-3' controlId='disease'>
                        <Form.Label className="col-md-4">History of lung disease:</Form.Label>
                        <div className="row col-md-4">
                            <Select
                                name='disease'
                                placeholder='Select...'
                                value={form.disease}
                                onChange={(event) => handleChange('disease', event)}
                                options={[
                                    { value: '0', label: 'COPD or Emphysema or chronic bronchitis' },
                                    { value: '1', label: 'None' },
                                    { value: '2', label: 'Unknown' },
                                ]}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className='row mb-3' controlId='history'>
                        <Form.Label className="col-md-4">Family history of lung cancer (must be blood relative), including parents and siblings?</Form.Label>
                        <div className="row col-md-4">
                            <Select
                                name='history'
                                placeholder='Select...'
                                value={form.history}
                                onChange={(event) => handleChange('history', event)}
                                options={[
                                    { value: '0', label: 'None' },
                                    { value: '1', label: 'One' },
                                    { value: '2', label: 'Two or more' },
                                    { value: '3', label: 'Unknown' },
                                ]}
                            />
                        </div>
                    </Form.Group>
                    {console.log(isValid())}
                    <div className="col-md-8 px-4 text-end">
                        <Button variant="primary" type="submit" onClick={handleSubmit} disabled={!isValid()}>
                            Calculate
                        </Button>
                        <Button variant="outline-secondary" className="me-1" type="reset">
                            Reset
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    )
}