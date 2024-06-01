import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = props => {
  const {history} = props
  const onClickFindJobs = () => {
    history.push('/jobs')
  }

  return (
    <div className="home-container">
      <Header />
      <div className="home-content-container">
        <h1 className="home-heading">Find The Job that Fits Your Life</h1>
        <p className="home-description">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your ablities and potential
        </p>
        <Link to="/jobs">
          <button
            type="button"
            className="find-jobs-button"
            onClick={onClickFindJobs}
          >
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Home
