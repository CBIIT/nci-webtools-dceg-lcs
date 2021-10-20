import { Navbar, NCIHeader } from '@cbiitss/react-components'
import './styles/main.scss';

function App() {
  return (
    <div style={{ backgroundColor: '#F1F1F1' }}>
        <NCIHeader 
        imageSource="assets/images/dceg-logo.svg" 
        url="https://dceg.cancer.gov/"
        style={{backgroundColor: 'white'}}
      />    
    </div>
  )
}

export default App;
