import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { useRecoilState } from "recoil";
import {
    resultsState
} from "../states/state";
import PDFDocument from 'pdfkit/js/pdfkit.standalone'
import blobStream from 'blob-stream'
import { saveAs } from 'file-saver'
import imageToBase64 from 'image-to-base64/browser';


export default function RiskResults() {
    const [results, setResult] = useRecoilState(resultsState);

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
            `BMI: ${results.bmi}`,
            `Racial or ethnic group: ${results.race_group.label}`,
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
            .font('Helvetica').text(`5-year risk of being diagnosed with lung cancer: `, 50, yPos, { continued: true, width: 200 }).font('Helvetica-Bold').text(`${getResult(2, 1) / 10}%`)
            .font('Helvetica').text(`5-year risk of dying from lung cancer:  `, 350, yPos, { continued: true, width: 200 }).font('Helvetica-Bold').text(`${getResult(0, 1) / 10}%`)

        yPos = doc.y

        var blueBox;
        var whiteBox;

        await imageToBase64(`assets/images/cellfill.png`).then((res) => {
            blueBox = `data:image/png;base64,${res}`
        })

        await imageToBase64(`assets/images/cellempty.png`).then((res) => {
            whiteBox = `data:image/png;base64,${res}`
        })

        await imageToBase64(`assets/images/grid_images/chart_rl_${results.results[2]}.png`).then((res) => {
            doc.image(`data:image/png;base64,${res}`, 50, yPos, { width: 225 })
        })
        await imageToBase64(`assets/images/grid_images/chart_rl_${results.results[0]}.png`).then((res) => {
            doc.image(`data:image/png;base64,${res}`, 350, yPos, { width: 225 }).moveDown(0.5)
        })

        yPos = doc.y
        doc.font('Helvetica')
        doc.image(blueBox, 50, yPos, { width: 8 })
        doc.text('Diagnosed with lung cancer', 65, yPos)
        doc.image(blueBox, 350, yPos, { width: 8 })
        doc.text('Death from lung cancer', 365, yPos)

        yPos = doc.y
        doc.image(whiteBox, 50, yPos, { width: 8 })
        doc.text('NOT diagnosed with lung cancer', 65, yPos)
        doc.image(whiteBox, 350, yPos, { width: 8 })
        doc.text('Alive (with or without lung cancer)', 365, yPos).moveDown(1)

        yPos = doc.y

        doc.addStructure(doc.struct('P', () => {
            doc
                .text(`This means that if 1000 people answer the questions just like you, `, 50, yPos, { continued: true, width: 250 })
                .font('Helvetica-Bold').text(`${results.results[2]}`, { continued: true })
                .font('Helvetica').text(' would be expected to recieve a lung cancer diagnosis in the next 5 years.')
        }))

        doc.addStructure(doc.struct('P', () => {
            doc
                .text(`This means that if 1000 people answer the questions just like you, `, 350, yPos, { continued: true, width: 250 })
                .font('Helvetica-Bold').text(`${results.results[0]}`, { continued: true })
                .font('Helvetica').text('  of them would die from lung cancer in the next 5 years.').moveDown(2)
        }))

        yPos = doc.y

        doc.addStructure(doc.struct('P', () => {
            doc.text(`Reminder: This is only risk of diagnosis and death over next five years`, 50, yPos).moveDown(1)
        }))

        yPos = doc.y

        doc.addStructure(doc.struct('P', () => {
            doc
                .font('Helvetica-Bold').text('The best way', 50, yPos, { continued: true })
                .font('Helvetica').text(' to lower your risk of lung cancer, and all smoking-related diseases, is to quit smoking. Learn more by visiting ', { continued: true })
                .fillColor('blue').text('smokefree.gov', { link: 'https://smokefree.gov/', underline: true, continued: true })
                .fillColor('black').text(', the CDC ', { continued: true, link: null, underline: false })
                .fillColor('blue').text('quitting smoking ', { link: 'https://www.cdc.gov/tobacco/quit_smoking/', underline: true, continued: true })
                .fillColor('black').text('page, or by calling 1-800-QUIT-NOW.', { link: null, underline: false }).moveDown(2)
        }))

        

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

                {(results.bmiSelection.value === 'bmi' || results.bmiSelection.value === 'unknonwn') && <div className='col-md-5'>
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

                {results.bmiSelection.value === 'bmi' && <div className='col-md-5'>
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
                    {results.bmi}
                </div>
            </div>

            <div className='row'>
                <div className='col-md-6'>
                    <b>Racial or ethnic group</b>
                </div>
                <div className='col-md-5'>
                    {results.race_group.label}
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

            <div>
                <table style={{ width: '100%', textAlign: 'center', border: '1px solid black' }}>
                    <tbody>
                        <tr><b>Lung Cancer Risk Assessment Results</b></tr>
                    </tbody>
                </table>

                <div className='row pt-3'>
                    <div className='col-md-6'>
                        <p>5-year risk of being diagnosed with lung cancer: <b>{getResult(2, 1)/10}%</b></p>
                    </div>
                    <div className='col-md-6'>
                        <p>5-year risk of dying from lung cancer: <b>{getResult(0, 1)/10}%</b></p>
                    </div>
                </div>

                <div className='row'>
                    <div className='col-md-6'>
                        <img id='img1' alt='chart-1' src={`assets/images/grid_images/chart_rl_${results.results[2]}.png`} />
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
                        <img alt='chart-2' src={`assets/images/grid_images/chart_rl_${results.results[0]}.png`} />
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
                        <p className='col-md-10'>This means that if 1000 people answer the questions just like you, <b>{results.results[2]}</b> would be expected to recieve a lung cancer diagnosis in the next 5 years.</p>
                    </div>
                    <div className='col-md-6'>
                        <p className='col-md-10'>This means that if 1000 people answer the questions just like you, <b>{results.results[0]} </b>
                            of them would die from lung cancer in the next 5 years.</p>
                    </div>
                </div>

                <div className='row pt-3'>
                    <p>Reminder: This is only risk of diagnosis and death over next five years</p>
                    <p>
                        <b>The best way</b> to lower your risk of lung cancer, and all smoking-related diseases, is to quit smoking. Learn more by visiting <a href="https://smokefree.gov/" target="smokefree">smokefree.gov</a>, the CDC <a href="https://www.cdc.gov/tobacco/quit_smoking/" target="cdcSmokeFree">quitting smoking</a> page, or by calling 1-800-QUIT-NOW.
                    </p>

                    <div ng-show="summary">You may save or print the summary report.</div><br />

                    <div>
                        <Button type="submit" onClick={exportPDF}>
                            Save Summary Report
                        </Button>
                    </div>
                </div>
            </div>
        </Container>
    )
}