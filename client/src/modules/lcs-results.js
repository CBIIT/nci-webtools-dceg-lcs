import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { useRecoilState } from "recoil";
import { useState } from "react";
import {
    resultsState
} from "../states/state";
import PDFDocument from 'pdfkit/js/pdfkit.standalone'
import blobStream from 'blob-stream'
import { saveAs } from 'file-saver'
import imageToBase64 from 'image-to-base64/browser';


export default function LCSResults() {
    const [results, setResult] = useRecoilState(resultsState);
    const [view, setView] = useState(false)
    const [data, showData] = useState(false)
    const [page, setPage] = useState(1)

    function handleShowResults() {
        setView(true)
    }

    function handleShowData() {
        showData(true)
    }

    function getHeight() {

        if (results.bmiSelection.value === 'bmi' || results.bmiSelection.value === 'unknown') {
            return 'Unknown'
        }

        if (results.units.value === 'us')
            return `${results.feet} feet ${results.inches} inch(es)`
        else
            return `${results.cm} cm(s)`
    }

    function getWeight() {

        if (results.bmiSelection.value === 'bmi' || results.bmiSelection.value === 'unknown') {
            return 'Unknown'
        }

        if (results.units.value === 'us')
            return `${results.pounds} pounds`
        else
            return `${results.kg} kgs`
    }

    async function exportPDF() {

        const doc = new PDFDocument()
        const stream = doc.pipe(blobStream())

        doc.fontSize(12)
        doc.font('Helvetica-Bold').text('Your Answers')
        doc.font('Helvetica')
        doc.fontSize(10)
        doc.addStructure(doc.struct('P', () => {
            doc.text('These results are based upon how you answered the following questions').moveDown(1)
        }))

        doc.addStructure(doc.struct('P', () => {
            doc.text('Questions:').moveDown(1)
        }))

        const questionSection = doc.struct('Sect')
        doc.addStructure(questionSection)

        const questions = doc.struct('List')
        questionSection.add(questions)

        var questionData = [
            `Age: ${results.age.value}`,
            `Gender: ${results.gender.label}`,
            `Height: ${getHeight(results)}`,
            `Weight: ${getWeight(results)}`,
            `BMI: ${results.realBMI ? results.realBMI : 'Unknown'}`,
            `Racial or ethnic group: ${results.raceUnknown ? 'Unknown. This risk assessment was based on data for whites.' : results.race_group.label}`,
            `Highest level of education obtained: ${results.education.label}`,
            `Type of smoker: ${results.smoker_type.label}`,
            `How old were you when you started smoking?: ${results.start.value}`
        ]

        if (results.smoker_type.value === 'former')
            questionData = questionData.concat([`How old were you when you quit successfully?: ${results.end}`])

        questionData = questionData.concat([
            `History of lung disease: ${results.disease.label}`,
            `Family history of lung cancer (must be blood relative), including parents and siblings: ${results.history.label}`,
            `Pack-years: ${results.packYears}`
        ])

        doc.list(questionData, { structParent: questions }).moveDown(1.5)
        doc.font('Helvetica-Bold').text('Benefits of Lung Cancer Screening', { align: 'center' }).moveDown(2)

        var yPos = doc.y
        doc
            .fontSize(9)
            .text('IF YOU DO NOT GET CT LUNG SCREENING', 50, yPos)
            .text('IF YOU DO GET CT LUNG SCREENING', 350, yPos).moveDown(1)

        yPos = doc.y
        doc
            .fontSize(9)
            .font('Helvetica').text(`Your chances of dying from lung cancer within 5 years are `, 50, yPos, { continued: true, width: 200 }).font('Helvetica-Bold').text(`${getResult(0, 1) / 10}%`)
            .font('Helvetica').text(`Your chances of dying from lung cancer within 5 years are `, 350, yPos, { continued: true, width: 200 }).font('Helvetica-Bold').text(`${(results.results[0] - results.results[1]) / 10}%`)

        yPos = doc.y

        var blueBox;
        var whiteBox;

        await imageToBase64(`assets/images/cellfill.png`).then((res) => {
            blueBox = `data:image/png;base64,${res}`
        })

        await imageToBase64(`assets/images/cellempty.png`).then((res) => {
            whiteBox = `data:image/png;base64,${res}`
        })

        await imageToBase64(`assets/images/grid_images/chart_rl_${results.results[0]}.png`).then((res) => {
            doc.image(`data:image/png;base64,${res}`, 50, yPos, { width: 225 })
        })
        await imageToBase64(`assets/images/grid_images/chart_rl_${results.results[0] - results.results[1]}.png`).then((res) => {
            doc.image(`data:image/png;base64,${res}`, 350, yPos, { width: 225 }).moveDown(0.5)
        })

        yPos = doc.y
        doc.font('Helvetica')
        doc.image(blueBox, 50, yPos, { width: 8 })
        doc.text('Death from lung cancer', 65, yPos)
        doc.image(blueBox, 350, yPos, { width: 8 })
        doc.text('Death from lung cancer', 365, yPos)

        yPos = doc.y
        doc.image(whiteBox, 50, yPos, { width: 8 })
        doc.text('Alive (with or without lung cancer)', 65, yPos)
        doc.image(whiteBox, 350, yPos, { width: 8 })
        doc.text('Alive (with or without lung cancer)', 365, yPos).moveDown(1)

        yPos = doc.y

        doc.addStructure(doc.struct('P', () => {
            doc
                .text(`This means that if 1000 people answer the questions just like you, `, 50, yPos, { continued: true, width: 250 })
                .font('Helvetica-Bold').text(`${results.results[0]}`, { continued: true })
                .font('Helvetica').text(' of them would die from lung cancer in the next 5 years if they did not receive CT lung screening.')
        }))
        
        doc.addStructure(doc.struct('P', () => {
            doc
                .text(`This means that if 1000 people answer the questions just like you, `, 350, yPos, { continued: true, width: 250 })
                .font('Helvetica-Bold').text(`${results.results[0] - results.results[1]}`, { continued: true })
                .font('Helvetica').text(' instead of ', { continued: true })
                .font('Helvetica-Bold').text(`${results.results[0]}`, { continued: true })
                .font('Helvetica').text(` ${getPeopleOrPerson(results.results[0])} would die from lung cancer if they receive yearly CT lung screening: a decrease of `, { continued: true })
                .font('Helvetica-Bold').text(`${getResult(1, 1)}`, { continued: true })
                .font('Helvetica').text(' out of 1000 people.').moveDown(1)
        }))

        yPos = doc.y

        doc.addStructure(doc.struct('P', () => {
            doc
                .text('Your chances of dying from lung cancer within 5 years will be reduced by ', 350, yPos, { continued: true, width: 250 })
                .font('Helvetica-Bold').text(`${getResult(1, 1)/10}%`)
        }))

        doc.addPage()

        doc.font('Helvetica-Bold').text('Other Information about Lung Cancer Screening', { align: 'center' }).moveDown(2)
        yPos = doc.y
        doc
            .fontSize(9)
            .text('IF YOU DO NOT GET CT LUNG SCREENING', 50, yPos)
            .text('IF YOU DO GET CT LUNG SCREENING', 350, yPos).moveDown(1)

        yPos = doc.y
        doc
            .fontSize(9)
            .font('Helvetica').text(`Your chances of being diagnosed with lung cancer within 5 years are `, 50, yPos, { continued: true, width: 200 }).font('Helvetica-Bold').text(`${getResult(2, 1) / 10}%`)
            .font('Helvetica').text(`Your chances of being diagnosed with lung cancer within 5 years are `, 350, yPos, { continued: true, width: 200 }).font('Helvetica-Bold').text(`${(results.results[3] + results.results[2]) / 10}%`)

        yPos = doc.y

        await imageToBase64(`assets/images/grid_images/chart_rl_${results.results[2]}.png`).then((res) => {
            doc.image(`data:image/png;base64,${res}`, 50, yPos, { width: 225 })
        })
        await imageToBase64(`assets/images/grid_images/chart_rl_${results.results[3] + results.results[2]}.png`).then((res) => {
            doc.image(`data:image/png;base64,${res}`, 350, yPos, { width: 225 }).moveDown(0.5)
        })

        yPos = doc.y
        doc.font('Helvetica')
        doc.image(blueBox, 50, yPos, { width: 8 })
        doc.text('Diagnosed with lung cancer', 65, yPos)
        doc.image(blueBox, 350, yPos, { width: 8 })
        doc.text('Diagnosed with lung cancer', 365, yPos)

        yPos = doc.y
        doc.image(whiteBox, 50, yPos, { width: 8 })
        doc.text('NOT diagnosed with lung cancer', 65, yPos)
        doc.image(whiteBox, 350, yPos, { width: 8 })
        doc.text('NOT diagnosed with lung cancer', 365, yPos).moveDown(1)

        yPos = doc.y

        doc.addStructure(doc.struct('P', () => {
            doc
                .text(`This means that if 1000 people answer the questions just like you, `, 50, yPos, { continued: true, width: 250 })
                .font('Helvetica-Bold').text(`${results.results[2]}`, { continued: true })
                .font('Helvetica').text(` ${getPeopleOrPerson(results.results[2])} would be diagnosed with lung cancer in the next 5 years if they did not receive CT lung screening.`)
        }))

        doc.addStructure(doc.struct('P', () => {
            doc
                .text(`This means that if 1000 people answer the questions just like you, `, 350, yPos, { continued: true, width: 250 })
                .font('Helvetica-Bold').text(`${results.results[3] + results.results[2]}`, { continued: true })
                .font('Helvetica').text(' instead of ', { continued: true })
                .font('Helvetica-Bold').text(`${results.results[2]}`, { continued: true })
                .font('Helvetica').text(` ${getPeopleOrPerson(results.results[2])} would be diagnosed with lung cancer if they receive yearly CT lung screening: an increase of `, { continued: true })
                .font('Helvetica-Bold').text(`${results.results[3]}`, { continued: true })
                .font('Helvetica').text(' out of 1000 people.')
        }))

        doc.moveDown(5)
        yPos = doc.y
        doc.font('Helvetica-Bold').text('Harms of Lung Cancer Screening', 225, yPos).moveDown(2)

        doc
            .fontSize(9)
            .text('IF YOU DO GET CT LUNG SCREENING', 50).moveDown(1)

        yPos = doc.y
        doc
            .fontSize(9)
            .font('Helvetica').text(`If you receive yearly CT lung screening for 3 years, your chances of receiving at least one "false alarm" (a false positive result) are `, 50, yPos, { continued: true, width: 300 })
            .font('Helvetica-Bold').text(`${results.results[4]}`, { continued: true })
            .font('Helvetica').text(' out of 1000 people.')

        yPos = doc.y

        await imageToBase64(`assets/images/grid_images/chart_rl_${results.results[4]}.png`).then((res) => {
            doc.image(`data:image/png;base64,${res}`, 50, yPos, { width: 225 }).moveDown(0.5)
        })

        yPos = doc.y
        doc.font('Helvetica')
        doc.image(blueBox, 50, yPos, { width: 8 })
        doc.text('Had a false alarm (positive screening test but does not actually have lung cancer)', 65, yPos)

        yPos = doc.y
        doc.image(whiteBox, 50, yPos, { width: 8 })
        doc.text('Did NOT have a false alarm', 65, yPos).moveDown(1)

        yPos = doc.y

        doc.addStructure(doc.struct('P', () => {
            doc
                .text(`This means that if 1000 people answer the questions just like you, `, 50, yPos, { continued: true, width: 250 })
                .font('Helvetica-Bold').text(`${results.results[4]}`, { continued: true })
                .font('Helvetica').text(` ${getPeopleOrPerson(results.results[4])} would receive a false alarm in the next 3 years if they received yearly CT lung screening.`).moveDown(2)
        }))

        doc.addStructure(doc.struct('P', () => {
            doc
                .font('Helvetica-Bold').text('The best way', { continued: true })
                .font('Helvetica').text(' to lower your risk of lung cancer, and all smoking-related diseases, is to quit smoking. Learn more by visiting ', { continued: true })
                .fillColor('blue').text('smokefree.gov', { link: 'https://smokefree.gov/', underline: true, continued: true })
                .fillColor('black').text(', the CDC ', { continued: true, link: null, underline: false })
                .fillColor('blue').text('quitting smoking ', { link: 'https://www.cdc.gov/tobacco/quit_smoking/', underline: true, continued: true })
                .fillColor('black').text('page, or by calling 1-800-QUIT-NOW.', { link: null, underline: false }).moveDown(2)
        }))

        doc.addStructure(doc.struct('P', () => {
            doc.text(`Learning about lung cancer and its treatment can help you prepare for your doctors' appointments. For more information about lung cancer screening, check out the following websites:`)
        }))

        doc.fillColor('blue')
        doc.text('MSKCC Lung Cancer Screening Decision Tool', { link: 'http://nomograms.mskcc.org/Lung/Screening.aspx', underline: true })
        doc.text('SIS Lung Cancer Screening Tool', { link: 'https://shouldiscreen.com/English/lung-cancer-risk-calculator', underline: true })
        doc.text('AHRQ Lung Cancer Screening Decision Tool', { link: 'https://effectivehealthcare.ahrq.gov/tools-and-resources/patient-decision-aids/lung-cancer-screening/patient/', underline: true })

        doc.end()

        stream.on('finish', function () {
            const blob = stream.toBlob('application/pdf')
            saveAs(blob, 'LungCancerScreeningResults.pdf')
        })
    }

    function getResult(num, type) {

        if (type) {
            if (results.results[num] === 0)
                return 1
            else
                return results.results[num]
        }
        else {
            if (results.results[num] === 0)
                return " (or less)"
        }
    }

    function getPeopleOrPerson(val) {
        if (val === 1) {
            return "person";
        };
        return "people";
    };

    const eligibility = () => {

        if (results.smoker_type.value === 'former') {

            if (results.age.value < 55 || results.age.value > 80 || results.packYears < 30 || (results.age.value - results.end) > 15)
                return false
        }
        else if (results.age.value < 55 || results.age.value > 80 || results.packYears < 30) {
            return false
        }

        return true
    }


    return (
        <Container id='print' className="my-4">
            <h2>Your Answers</h2>
            <p>These results are based upon how you answered the following questions</p>
            <p>Questions:</p>

            <div className='row'>
                <div className='col-md-6'>
                    <b>Age</b>
                </div>
                <div className='col-md-5'>
                    {results.age.value}
                </div>
            </div>

            <div className='row'>
                <div className='col-md-6'>
                    <b>Gender</b>
                </div>
                <div className='col-md-5'>
                    {results.gender.label}
                </div>
            </div>

            <div className='row'>
                <div className='col-md-6'>
                    <b>Height</b>
                </div>

                {(results.bmiSelection.value === 'bmi' || results.bmiSelection.value === 'unknown') && <div className='col-md-5'>
                    Unknown
                </div>}

                {results.bmiSelection.value === 'hw' && results.units.value === 'us' && <div className='col-md-5'>
                    {results.feet} feet {results.inches} inch(es)
                </div>}

                {results.bmiSelection.value === 'hw' && results.units.value === 'metric' && <div className='col-md-5'>
                    {results.cm} cm(s)
                </div>}
            </div>

            <div className='row'>
                <div className='col-md-6'>
                    <b>Weight</b>
                </div>

                {(results.bmiSelection.value === 'bmi' || results.bmiSelection.value === 'unknown') && <div className='col-md-5'>
                    Unknown
                </div>}

                {results.bmiSelection.value === 'hw' && results.units.value === 'us' && <div className='col-md-5'>
                    {results.pounds} pounds
                </div>}

                {results.bmiSelection.value === 'hw' && results.units.value === 'metric' && <div className='col-md-5'>
                    {results.kg} kgs
                </div>}
            </div>

            <div className='row'>
                <div className='col-md-6'>
                    <b>BMI</b>
                </div>
                <div className='col-md-5'>
                    {results.realBMI ? results.realBMI : 'Unknown'}
                </div>
            </div>

            <div className='row'>
                <div className='col-md-6'>
                    <b>Racial or ethnic group</b>
                </div>
                <div className='col-md-5'>
                    {results.raceUnknown ? 'Unknown. This risk assessment was based on data for whites.' : results.race_group.label}
                </div>
            </div>

            <div className='row'>
                <div className='col-md-6'>
                    <b>Highest level of education obtained</b>
                </div>
                <div className='col-md-5'>
                    {results.education.label}
                </div>
            </div>

            <div className='row'>
                <div className='col-md-6'>
                    <b>Type of Smoker</b>
                </div>
                <div className='col-md-5'>
                    {results.smoker_type.label}
                </div>
            </div>

            <div className='row'>
                <div className='col-md-6'>
                    <b className='mx-5'>How old were you when you started smoking?</b>
                </div>
                <div className='col-md-5'>
                    {results.start.value}
                </div>
            </div>

            {results.smoker_type.value === 'former' && <div className='row'>
                <div className='col-md-6'>
                    <b className='mx-5'>How old were you when you quit successfully?</b>
                </div>
                <div className='col-md-5'>
                    {results.end}
                </div>
            </div>}

            <div className='row'>
                <div className='col-md-6'>
                    {results.smoker_type.value === 'current' && <b className='mx-5'>On a typical day, how many cigarettes do you smoke?</b>}
                    {results.smoker_type.value === 'former' && <b className='mx-5'>On a typical day, how many cigarettes did you smoke?</b>}
                </div>
                <div className='col-md-5'>
                    {results.cigs}
                </div>
            </div>

            <div className='row'>
                <div className='col-md-6'>
                    <b>History of lung disease</b>
                </div>
                <div className='col-md-5'>
                    {results.disease.label}
                </div>
            </div>

            <div className='row'>
                <div className='col-md-6'>
                    <b>Family history of lung cancer (must be blood relative), including parents and siblings</b>
                </div>
                <div className='col-md-5'>
                    {results.history.label}
                </div>
            </div>

            <div className='row'>
                <div className='col-md-6'>
                    <b>Pack-years</b>
                </div>
                <div className='col-md-5'>
                    {Number(results.packYears).toFixed(2)}
                </div>
            </div>

            <p className='mt-3'>
                You will receive four pieces of information: (1) whether you are recommended for CT lung screening by the <a target="_blank" href="https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/lung-cancer-screening">US Preventive Services Task Force</a> (a group of experts who make recommendations about prevention), (2) risk of dying from lung cancer, (3) risk of a false alarm (you have a positive screening test but do not actually have lung cancer), and (4) risk of being diagnosed with lung cancer.
            </p>

            {!view && <p>
                To obtain these results, click here:
                <Button className='mx-1' type="submit" onClick={handleShowResults}>
                    SEE MY RESULTS
                </Button>
            </p>}

            {view && <p style={{ fontWeight: 'bold', fontSize: '120%' }}>
                The <a style={{ fontWeight: 'bold' }} target="_blank" href='https://analysistools.cancer.gov/lungCancerScreening/#!/results'>US Preventive Services Task Force</a>
                {eligibility() ? ' RECOMMENDS CT lung screening for someone like you.' :
                    ` does NOT recommend CT lung screening for someone like you. They recommend screening for those who are ages 55 to 80, have smoked at least 30 pack-years, and have quit for no longer than 15 years. You are age ${results.age.value} and have smoked ${Number(results.packYears).toFixed(2)} pack-years
                  ${results.smoker_type === 'former' ? ` and have quit for ${results.age.value - results.end} years` : '.'}`
                }
                {!data && <Button className='mx-1' type="submit" onClick={handleShowData}>
                    Next
                </Button>}
            </p>}



            {data && <div>
                {page === 1 && <div>
                    <table style={{ width: '100%', textAlign: 'center', border: '1px solid black' }}>
                        <tbody>
                            <tr><b>Benefits of Lung Cancer Screening</b></tr>
                        </tbody>
                    </table>

                    <div className='row pt-3'>
                        <div className='col-md-6'>
                            <b>IF YOU DO NOT GET CT LUNG SCREENING</b>
                        </div>
                        <div className='col-md-6'>
                            <b>IF YOU DO GET CT LUNG SCREENING</b>
                        </div>
                    </div>

                    <div className='row pt-3'>
                        <div className='col-md-6'>
                            <p>Your chances of dying from lung cancer within 5 years are <b>{getResult(0, 1) / 10}%</b></p>
                        </div>
                        <div className='col-md-6'>
                            <p>Your chances of dying from lung cancer within 5 years are <b>{(results.results[0] - results.results[1]) / 10}%</b></p>
                        </div>
                    </div>

                    <div className='row pt-3'>
                        <div className='col-md-6'>
                            <img id='img1' alt='chart-1' src={`assets/images/grid_images/chart_rl_${results.results[0]}.png`} />
                            <div>
                                <span>
                                    <img style={{ width: '10px', height: '10px', border: '1px solid #777', marginRight: '5px' }} src="assets/images/cellfill.png" alt="filled cell" />Death from lung cancer<br />
                                </span>
                                <span>
                                    <img style={{ width: '10px', height: '10px', border: '1px solid #777', marginRight: '5px' }} src="assets/images/cellempty.png" alt="empty cell" />Alive (with or without lung cancer)
                                </span>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <img alt='chart-2' src={`assets/images/grid_images/chart_rl_${results.results[0] - results.results[1]}.png`} />
                            <div>
                                <span>
                                    <img style={{ width: '10px', height: '10px', border: '1px solid #777', marginRight: '5px' }} src="assets/images/cellfill.png" alt="filled cell" />Death from lung cancer<br />
                                </span>
                                <span>
                                    <img style={{ width: '10px', height: '10px', border: '1px solid #777', marginRight: '5px' }} src="assets/images/cellempty.png" alt="empty cell" />Alive (with or without lung cancer)
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className='row pt-3'>
                        <div className='col-md-6'>
                            <p className='col-md-10'>This means that if 1000 people answer the questions just like you, <b>{results.results[0]}</b> of them would die from lung cancer in the next 5 years if they did not receive CT lung screening.</p>
                        </div>
                        <div className='col-md-6'>
                            <p className='col-md-10'>This means that if 1000 people answer the questions just like you, <b>{results.results[0] - results.results[1]} </b>
                                instead of <b>{results.results[0]}</b> {getPeopleOrPerson(results.results[0])} would
                                die from lung cancer if they receive yearly CT lung screening: a
                                decrease of <b>{getResult(1, 1)}</b> out of 1000 people. </p>

                            <p>Your chances of dying from lung cancer within 5 years will reduced by <b>{results.results[1]/10}%</b></p>
                            <Button type="submit" onClick={() => setPage(2)}>
                                Next
                            </Button>
                        </div>
                    </div>
                </div>}

                {page === 2 && <div>
                    <table style={{ width: '100%', textAlign: 'center', border: '1px solid black' }}>
                        <tbody>
                            <tr><b>Other Information about Lung Cancer Screening</b></tr>
                        </tbody>
                    </table>

                    <div className='row pt-3'>
                        <div className='col-md-6'>
                            <b>IF YOU DO NOT GET CT LUNG SCREENING</b>
                        </div>
                        <div className='col-md-6'>
                            <b>IF YOU DO GET CT LUNG SCREENING</b>
                        </div>
                    </div>

                    <div className='row pt-3'>
                        <div className='col-md-6'>
                            <p>Your chances of being diagnosed with lung cancer within 5 years are <b>{getResult(2, 1) / 10}%</b></p>
                        </div>
                        <div className='col-md-6'>
                            <p>Your chances of being diagnosed with lung cancer within 5 years are <b>{(results.results[3] + results.results[2]) / 10}%</b></p>
                        </div>
                    </div>

                    <div className='row pt-3'>
                        <div className='col-md-6'>
                            <img alt='chart-3' src={`assets/images/grid_images/chart_rl_${results.results[2]}.png`} />
                            <div>
                                <span>
                                    <img style={{ width: '10px', height: '10px', border: '1px solid #777', marginRight: '5px' }} src="assets/images/cellfill.png" alt="filled cell" />Diagnosed with lung cancer<br />
                                </span>
                                <span>
                                    <img style={{ width: '10px', height: '10px', border: '1px solid #777', marginRight: '5px' }} src="assets/images/cellempty.png" alt="empty cell" />NOT diagnosed with lung cancer
                                </span>
                            </div>
                        </div>

                        <div className='col-md-6'>
                            <img alt='chart-2' src={`assets/images/grid_images/chart_rl_${results.results[3] + results.results[2]}.png`} />
                            <div>
                                <span>
                                    <img style={{ width: '10px', height: '10px', border: '1px solid #777', marginRight: '5px' }} src="assets/images/cellfill.png" alt="filled cell" />Diagnosed with lung cancer<br />
                                </span>
                                <span>
                                    <img style={{ width: '10px', height: '10px', border: '1px solid #777', marginRight: '5px' }} src="assets/images/cellempty.png" alt="empty cell" />NOT diagnosed with lung cancer
                                </span>
                            </div>
                        </div>

                        <div className='row pt-3'>
                            <div className='col-md-6'>
                                <p className='col-md-10'>This means that if 1000 people answer the questions just like you, <b>{results.results[2]}</b> {getPeopleOrPerson(results.results[2])} would be diagnosed with lung cancer in the next 5 years if they did not receive CT lung screening.</p>
                            </div>
                            <div className='col-md-6'>
                                <p className='col-md-10'>This means that if 1000 people answer the questions just like you,
                                    <b> {results.results[3] + results.results[2]} </b>
                                    instead of <b>{results.results[2]}</b> {getPeopleOrPerson(results.results[2])} would be diagnosed with lung cancer
                                    if they receive yearly CT lung screening: an
                                    increase of <b>{results.results[3]}</b> out of 1000 people.</p>

                                <p className='col-md-10'>Your chances of being diagnosed with lung cancer within 5 years will be increased by <b>{results.results[3] / 10}%</b>.</p>

                                <Button className='mx-1' type="submit" onClick={() => setPage(1)}>
                                    Back
                                </Button>
                                <Button type="submit" onClick={() => setPage(3)}>
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>}

                {page === 3 && <div>
                    <table style={{ width: '100%', textAlign: 'center', border: '1px solid black' }}>
                        <tbody>
                            <tr><b>Harms of Lung Cancer Screening</b></tr>
                        </tbody>
                    </table>
                    <div className='row pt-3'>
                        <div className='col-md-4'>
                        </div>
                        <div className='col-md-5'>
                            <b>IF YOU DO GET CT LUNG SCREENING</b>
                            <div className='pt-3'>
                                <p>If you receive yearly CT lung screening for 3 years, your chances of receiving at least one "false alarm" (a false positive result) are <b>{results.results[4]}</b> out of 1000 people.</p>
                            </div>
                            <div className='row pt-3'>
                                <img className='col-md-7' alt='chart-4' src={`assets/images/grid_images/chart_rl_${results.results[4]}.png`} />
                                <div>
                                    <span>
                                        <img style={{ width: '10px', height: '10px', border: '1px solid #777', marginRight: '5px' }} src="assets/images/cellfill.png" alt="filled cell" />Had a false alarm (positive screening test but does not actually have lung cancer)<br />
                                    </span>
                                    <span>
                                        <img style={{ width: '10px', height: '10px', border: '1px solid #777', marginRight: '5px' }} src="assets/images/cellempty.png" alt="empty cell" />Did NOT have a false alarm
                                    </span>
                                </div>
                            </div>
                            <div className='pt-3 col-md-12'>
                                <p >This means that if 1000 people answer the questions just like you, <b>{results.results[4]} </b>
                                    {getPeopleOrPerson(results.results[4])} would receive a false alarm in the next 3 years
                                    if they received yearly CT lung screening.</p>

                                <Button type="submit" onClick={() => setPage(2)}>
                                    Back
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className='row pt-3'>
                        <p>
                            <b>The best way</b> to lower your risk of lung cancer, and all smoking-related diseases, is to quit smoking. Learn more by visiting <a href="https://smokefree.gov/" target="smokefree">smokefree.gov</a>, the CDC <a href="https://www.cdc.gov/tobacco/quit_smoking/" target="cdcSmokeFree">quitting smoking</a> page, or by calling 1-800-QUIT-NOW.
                        </p>

                        <p>
                            Learning about lung cancer and its treatment can help you prepare for your doctors' appointments. For more information about
                            lung cancer screening, check out the following websites:<br />
                            <a href="http://nomograms.mskcc.org/Lung/Screening.aspx" target="_blank">MSKCC Lung Cancer Screening Decision Tool</a><br
                            />
                            <a href="http://www.shouldiscreen.com/lung-cancer-risk-calculator" target="_blank">SIS Lung Cancer Screening Tool</a><br
                            />
                            <a href="https://www.effectivehealthcare.ahrq.gov/tools-and-resources/patient-decision-aids/lung-cancer-screening/patient/"
                                target="_blank">AHRQ Lung Cancer Screening Decision Tool</a><br />
                        </p>

                        <div ng-show="summary">We know that was a lot of information, you may save or print the summary report</div><br />

                        <div>
                            <Button type="submit" onClick={exportPDF}>
                                Save Summary Report
                            </Button>
                        </div>
                    </div>
                </div>}
            </div>}
        </Container>
    )
}