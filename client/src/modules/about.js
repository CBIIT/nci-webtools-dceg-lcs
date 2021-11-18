import Container from "react-bootstrap/Container";

export default function About() {

    return (
        <Container className="my-4">
            <h3>Information about the NLST</h3>
            <div className='my-4'>
                <p>The National Lung Screening Trial (NLST) compared two ways of finding out whether someone has lung cancer: <a href="https://www.cancer.gov/types/lung/patient/lung-screening-pdq#section/_13" target="lungScreeningPdq">low-dose helical computed tomography (CT) (also known as spiral CT) and a standard chest X-ray</a>.</p>
                <p>The study found that CT lung screening reduced lung cancer death.</p>
                <p>As a result, the <a href="https://www.uspreventiveservicestaskforce.org/Page/Document/UpdateSummaryFinal/lung-cancer-screening" target="USPreventiveServiceTaskForce">US Preventive Services Task Force</a> (a group of experts who make recommendations about prevention) recommends CT lung screening for smokers aged 55-80 with at least <a href="https://www.cancer.gov/publications/dictionaries/cancer-terms/def/pack-year" target="_blank">30 pack-years</a>, and no more than 15 years since quitting.</p>
            </div>
        </Container>
    )

}