import { NCIHeader } from '@cbiitss/react-components'
import { RecoilRoot, useRecoilState } from "recoil";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import './styles/main.scss';
import Home from "./modules/home";
import LCSResults from './modules/lcs-results';
import About from './modules/about';
import BootstrapNavbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Nav, NavDropdown, Modal, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  defaultFormState,
  resultsState
} from './states/state';
import { useState } from 'react';

function LCScreening() {

  const [results, setResult] = useRecoilState(resultsState)
  const [show, setShow] = useState(true)

  const handleClose = () => setShow(false)

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      <NCIHeader
        imageSource="assets/images/dceg-logo.svg"
        url="https://dceg.cancer.gov/"
        style={{ backgroundColor: 'white' }}
      />
      <div className="bg-primary text-light py-1 d-none d-md-block">
        <div className="container">
          <h1 className="h5 py-2">
            Risk-based NLST Outcomes Tool(RNOT)
          </h1>
        </div>
      </div>


      <Modal show={show} size='lg' onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Disclaimer</Modal.Title>
        </Modal.Header>
        <Modal.Body>The Lung Cancer Risk Assessment Tool was designed for use by researchers, or to provide general health information. It is not a substitute for medical advice, diagnosis, or treatment of any health condition or problem. If you have questions after using this tool, address them to your healthcare provider. You should always consult with a healthcare provider before making any decisions, or undertaking any actions or not undertaking any actions related to any healthcare problem or issue you might have at any time, now or in the future. Research on lung cancer risk changes frequently; information contained in the tool may be outdated, incomplete or incorrect.</Modal.Body>
        <Modal.Footer>
            <Button variant='primary' onClick={handleClose}>
              I UNDERSTAND
            </Button>
        </Modal.Footer>
      </Modal>

      <Router>
        <BootstrapNavbar className={"shadow-sm"}>
          <Container>
            <Nav className="me-auto collapse navbar-collapse">
              <NavLink
                to={'/'}
                id={'home'}
                key={'/'}
                activeClassName="active"
                className="nav-link"
                exact={true}>
                Home
              </NavLink>
              <NavLink
                to={'/results'}
                id={'results'}
                key={'/results'}
                onClick={(e) => { if (!results.submitted) { e.preventDefault() } }}
                style={{
                  cursor: !results.submitted ? 'default' : 'pointer',
                  color: !results.submitted ? 'grey' : '#185394'
                }}
                activeClassName="active"
                className="nav-link">
                Personalized Risk
              </NavLink>
              <NavLink
                to={'/about'}
                id={'about'}
                key={'/about'}
                activeClassName="active"
                className="nav-link">
                About NLST
              </NavLink>
              <NavDropdown title="Further Information" id="basic-nav-dropdown">
                <NavDropdown.Item href="http://nomograms.mskcc.org/Lung/Screening.aspx" target='_blank'>MSKCC Lung Cancer Screening Decision Tool</NavDropdown.Item>
                <NavDropdown.Item href="http://www.shouldiscreen.com/lung-cancer-risk-calculator" target="_blank">SIS Lung Cancer Screening Tool</NavDropdown.Item>
                <NavDropdown.Item href="https://effectivehealthcare.ahrq.gov/decision-aids/lung-cancer-screening/patient.html" target="_blank">AHRQ Lung Cancer Screening Decision Tool</NavDropdown.Item>
                <NavDropdown.Item href="http://jama.jamanetwork.com/article.aspx?articleID=2522553" target="_blank">Development and Validation of Risk Models to Select Ever-Smokers for CT Lung Cancer Screening</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Container>
        </BootstrapNavbar>
        <Switch>
          <Route path="/" exact={true} component={Home} />
          <Route path="/results" component={LCSResults} />
          <Route path="/about" component={About} />
        </Switch>
      </Router>
      <Container className='pb-5'>
        <fieldset className='p-3' style={{ border: '1px solid lightgrey', backgroundColor: '#F2F1F8', borderRadius: '4px' }}>
          If you have any questions regarding the assessment questions and results, please
          <a href="mailto:katkih@mail.nih.gov?subject=LungCancerScreeningTool" target="_top" title="email to us"> send an email to us.</a>
        </fieldset>
      </Container>

      <footer class="flex-grow-0">
        <div class="bg-primary text-light py-4">
          <div class="container">
            <div class="mb-4">
              <a
                target="_blank"
                href="https://dceg.cancer.gov/"
                class="text-light h4 mb-1"
              >
                Division of Cancer Epidemiology & Genetics
              </a>
              <div class="h6">
                at the National Cancer Institute
              </div>
            </div>
            <div class="row">
              <div class="col-lg-4 mb-4">
                <div class="h5 mb-1 font-weight-light">CONTACT INFORMATION</div>
                <ul class="list-unstyled mb-0">
                  <li>
                    <a
                      class="text-light"
                      href="mailto:NCIcProSiteWebAdmin@mail.nih.gov"
                    >
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
              <div class="col-lg-4 mb-4">
                <div class="h5 mb-1 font-weight-light">POLICIES</div>
                <ul class="list-unstyled mb-0">
                  <li>
                    <a
                      class="text-light"
                      target="_blank"
                      href="https://www.cancer.gov/policies/accessibility"
                    >
                      Accessibility
                    </a>
                  </li>
                  <li>
                    <a
                      class="text-light"
                      target="_blank"
                      href="https://www.cancer.gov/policies/disclaimer"
                    >
                      Disclaimer
                    </a>
                  </li>
                  <li>
                    <a
                      class="text-light"
                      target="_blank"
                      href="https://www.cancer.gov/policies/foia"
                    >
                      FOIA
                    </a>
                  </li>
                </ul>
              </div>
              <div class="col-lg-4 mb-4">
                <div class="h5 mb-1 font-weight-light">MORE INFORMATION</div>
                <ul class="list-unstyled mb-0">
                  <li>
                    <a class="text-light" target="_blank" href="http://www.hhs.gov/">
                      U.S. Department of Health and Human Services
                    </a>
                  </li>
                  <li>
                    <a class="text-light" target="_blank" href="http://www.nih.gov/">
                      National Institutes of Health
                    </a>
                  </li>
                  <li>
                    <a class="text-light" target="_blank" href="https://www.cancer.gov/">
                      National Cancer Institute
                    </a>
                  </li>
                  <li>
                    <a class="text-light" target="_blank" href="http://usa.gov/">USA.gov</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="text-center">NIH ... Turning Discovery Into Health ®</div>
        </div>
      </footer>
    </div>

  )
}

export default LCScreening;
