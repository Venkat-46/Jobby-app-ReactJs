import {Component} from 'react'
import {IoIosSearch} from 'react-icons/io'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import JobCard from '../JobCard'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const statusObj = {
  initial: 'INITIAL',
  inProcess: 'INPROCESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const jobsStatusObj = {
  initial: 'INITIAL',
  inProcess: 'INPROCESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    apiStatus: statusObj.initial,
    jobsApiStatus: jobsStatusObj.initial,
    searchQuery: '',
    userProfile: {},
    jobType: [],
    salaryType: '',
    jobCardsList: [],
  }

  componentDidMount() {
    this.getUserProfile()
    this.getJobsData()
  }

  convertToCamelcase = each => ({
    companyLogoUrl: each.company_logo_url,
    employmentType: each.employment_type,
    id: each.id,
    jobDescription: each.job_description,
    location: each.location,
    packagePerAnnum: each.package_per_annum,
    rating: each.rating,
    title: each.title,
  })

  getUserProfile = async () => {
    this.setState({apiStatus: statusObj.inProcess})
    const jwtToken = Cookies.get('jwt_token')
    const profileUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(profileUrl, options)
    if (response.ok) {
      const data = await response.json()
      const profileData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({userProfile: profileData, apiStatus: statusObj.success})
    } else {
      this.setState({apiStatus: statusObj.failure})
    }
  }

  getJobsData = async () => {
    this.setState({jobsApiStatus: jobsStatusObj.inProcess})
    const jwtToken = Cookies.get('jwt_token')

    const {searchQuery, jobType, salaryType} = this.state
    const jobTypesJoin = jobType.join()
    const jobCardUrl = `https://apis.ccbp.in/jobs?employment_type=${jobTypesJoin}&minimum_package=${salaryType}&search=${searchQuery}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(jobCardUrl, options)

    if (response.ok) {
      const data = await response.json()
      const jobsData = data.jobs.map(each => this.convertToCamelcase(each))
      this.setState({
        jobCardsList: jobsData,
        jobsApiStatus: jobsStatusObj.success,
      })
    } else {
      this.setState({jobsApiStatus: jobsStatusObj.failure})
    }
  }

  onChangeUserinput = event => {
    this.setState({searchQuery: event.target.value}, this.getJobsData)
  }

  onChangeJobType = event => {
    this.setState(
      prevState => ({
        jobType: [...prevState.jobType, event.target.value],
      }),
      this.getJobsData,
    )
  }

  onChangeSalaryType = event => {
    this.setState({salaryType: event.target.value}, this.getJobsData)
  }

  renderSalaryFilters = eachItem => {
    const {label, salaryRangeId} = eachItem

    return (
      <li key={salaryRangeId} className="job-filter-list-item">
        <input
          id={salaryRangeId}
          type="radio"
          name="Salary"
          value={salaryRangeId}
          onChange={this.onChangeSalaryType}
          className="checkbox"
        />
        <label htmlFor={salaryRangeId} className="label-text">
          {label}
        </label>
      </li>
    )
  }

  renderEploymentFilters = eachItem => {
    const {label, employmentTypeId} = eachItem

    return (
      <li key={employmentTypeId} className="job-filter-list-item">
        <input
          id={employmentTypeId}
          type="checkbox"
          value={employmentTypeId}
          onChange={this.onChangeJobType}
          className="checkbox"
        />
        <label htmlFor={employmentTypeId} className="label-text">
          {label}
        </label>
      </li>
    )
  }

  onClickRetry = () => this.getUserProfile()

  renderProfileFailureView = () => (
    <div className="profile-failure-contaner">
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickRetry}
      >
        Retry
      </button>
    </div>
  )

  renderProfileSuccess = () => {
    const {userProfile} = this.state

    const {name, profileImageUrl, shortBio} = userProfile

    return (
      <div className="user-data-container">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <p className="name-text">{name}</p>
        <p className="short-bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileLoaderview = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderUserDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case statusObj.inProcess:
        return this.renderProfileLoaderview()
      case statusObj.success:
        return this.renderProfileSuccess()
      case statusObj.failure:
        return this.renderProfileFailureView()
      default:
        return null
    }
  }

  onClickRetryJobs = () => {
    this.getJobsData()
  }

  renderJobsFailureView = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="no-jobs-img"
      />
      <h1 className="no-jobs-heading">Oops! Something Went Wrong</h1>
      <p className="no-jobs-text">
        We cannot seems to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickRetryJobs}
      >
        Retry
      </button>
    </div>
  )

  renderJobsSuccessView = () => {
    const {jobCardsList} = this.state

    return (
      <>
        {jobCardsList.length > 0 ? (
          <ul className="job-cards-list-container">
            {jobCardsList.map(eachItem => (
              <JobCard key={eachItem.id} jobCardDetails={eachItem} />
            ))}
          </ul>
        ) : (
          <div className="no-jobs-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
              className="no-jobs-img"
            />
            <h1 className="no-jobs-heading">No Jobs Found</h1>
            <p className="no-jobs-text">
              We could not find any jobs. Try other filters
            </p>
          </div>
        )}
      </>
    )
  }

  renderJobsInProcessView = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobCards = () => {
    const {jobsApiStatus} = this.state

    switch (jobsApiStatus) {
      case jobsStatusObj.inProcess:
        return this.renderJobsInProcessView()
      case jobsStatusObj.success:
        return this.renderJobsSuccessView()
      case jobsStatusObj.failure:
        return this.renderJobsFailureView()
      default:
        return null
    }
  }

  render() {
    const {searchQuery, jobType} = this.state
    console.log(jobType)
    return (
      <div className="jobs-main-container">
        <Header />
        <div className="jobs-profile-container">
          <div className="profile-container">
            <div className="userinput-container">
              <input
                type="search"
                value={searchQuery}
                placeholder="Search"
                onChange={this.onChangeUserinput}
                className="search-input"
              />
              <button
                data-testid="searchButton"
                type="button"
                className="search-icon-button"
              >
                .<IoIosSearch className="icon" />
              </button>
            </div>
            <div className="user-details-container">
              {this.renderUserDetails()}
              <hr className="hr-line" />
            </div>
            <ul className="job-filters-list-container">
              <li className="job-filter-list-item-heading">
                <p className="filter-heading">Type of Employment</p>
              </li>
              {employmentTypesList.map(eachItem =>
                this.renderEploymentFilters(eachItem),
              )}
              <hr className="hr-line" />
            </ul>
            <ul className="salary-filters-list-container">
              <li className="job-filter-list-item-heading">
                <p className="salary-filter-heading">Salary Range</p>
              </li>
              {salaryRangesList.map(eachItem =>
                this.renderSalaryFilters(eachItem),
              )}
            </ul>
          </div>
          <div className="job-cards-section">
            <div className="desk-userinput-container">
              <input
                type="search"
                value={searchQuery}
                placeholder="Search"
                onChange={this.onChangeUserinput}
                className="search-input"
              />
              <button
                type="button"
                className="search-icon-button"
                data-testid="searchButton"
              >
                .<IoIosSearch className="icon" />
              </button>
            </div>
            <div className="job-cards-container">{this.renderJobCards()}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
