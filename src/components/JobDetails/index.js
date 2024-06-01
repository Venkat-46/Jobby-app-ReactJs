import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {IoStar} from 'react-icons/io5'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiExternalLink} from 'react-icons/fi'
import Header from '../Header'
import SimilarJobCard from '../SimilarJobCard'
import './index.css'

const statusObj = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobDetails extends Component {
  state = {
    apiStatus: statusObj.initial,
    jobDetailsObj: {},
    similarJobs: [],
    lifeAtCompany: {},
    skillsList: [],
  }

  componentDidMount() {
    this.getJobDetails()
  }

  convertNormalCase = item => ({
    companyLogoUrl: item.company_logo_url,
    companyWebsiteUrl: item.company_website_url,
    employmentType: item.employment_type,
    id: item.id,
    title: item.title,
    jobDescription: item.job_description,
    location: item.location,
    packagePerAnnum: item.package_per_annum,
    rating: item.rating,
  })

  convertSkillsData = each => ({
    imageUrl: each.image_url,
    name: each.name,
  })

  convertSimilarJobs = each => ({
    companyLogoUrl: each.company_logo_url,
    employmentType: each.employment_type,
    id: each.id,
    jobDescription: each.job_description,
    location: each.location,
    rating: each.rating,
    title: each.title,
  })

  getJobDetails = async () => {
    this.setState({apiStatus: statusObj.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()

      const jobDetailsData = this.convertNormalCase(data.job_details)

      const skillsDataList = data.job_details.skills.map(each =>
        this.convertSkillsData(each),
      )

      const lifeAtCompanyData = {
        description: data.job_details.life_at_company.description,
        imageUrl: data.job_details.life_at_company.image_url,
      }

      const similarJobsData = data.similar_jobs.map(each =>
        this.convertSimilarJobs(each),
      )

      this.setState({
        jobDetailsObj: jobDetailsData,
        skillsList: skillsDataList,
        lifeAtCompany: lifeAtCompanyData,
        similarJobs: similarJobsData,
        apiStatus: statusObj.success,
      })
    } else {
      this.setState({apiStatus: statusObj.failure})
    }
  }

  onClickRetryJobs = () => {
    this.getJobDetails()
  }

  renderFailureView = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="no-jobs-img"
      />
      <h1 className="no-jobs-heading">Oops! Something Went Wrong</h1>
      <p className="no-jobs-text">
        We cannot seem to find the page you are looking for
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

  renderInProgressView = () => (
    <div className="similar-job-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderSkillItem = each => {
    const {imageUrl, name} = each
    return (
      <li key={name} className="skill-item-container">
        <img src={imageUrl} alt={name} className="skill-img" />
        <p className="skill-name-text">{name}</p>
      </li>
    )
  }

  renderSuccessView = () => {
    const {jobDetailsObj, lifeAtCompany, skillsList, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      id,
      title,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
    } = jobDetailsObj
    return (
      <div className="job-details-section">
        <div className="job-details-card-container">
          <div className="heading-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="job-role-rating-container">
              <h1 className="title-text">{title}</h1>
              <div className="rating-container">
                <IoStar className="rating-logo" />
                <p className="rating-text">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-basic-details-container">
            <div className="location-job-container">
              <div className="location-container">
                <MdLocationOn className="location-icon" />
                <p>{location}</p>
              </div>
              <div className="job-type-container">
                <BsBriefcaseFill className="job-icon" />
                <p>{employmentType}</p>
              </div>
            </div>
            <p className="package-text">{packagePerAnnum}</p>
          </div>
          <hr className="hrs-line" />
          <div className="description-heading-container">
            <h1 className="description-heading-text">Description</h1>
            <div className="company-url-container">
              <a href={companyWebsiteUrl} target="new" className="link-ele">
                Visit
              </a>
              <FiExternalLink className="external-link-icon" />
            </div>
          </div>
          <p className="description-text">{jobDescription}</p>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-list-container">
            {skillsList.map(eachItem => this.renderSkillItem(eachItem))}
          </ul>
          <h1 className="description-heading-text">Life at Company</h1>
          <div className="life-at-company-container">
            <p className="life-at-company-description-text">
              {lifeAtCompany.description}
            </p>
            <img
              src={lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-at-company-img"
            />
          </div>
        </div>
        <div className="similar-jobs-container">
          <h1>Similar Jobs</h1>
          <ul className="similar-jobs-list-container">
            {similarJobs.map(eachItem => (
              <SimilarJobCard key={eachItem.id} jobDetails={eachItem} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderJobdetailsView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case statusObj.inProgress:
        return this.renderInProgressView()
      case statusObj.success:
        return this.renderSuccessView()
      case statusObj.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {jobDetailsObj, lifeAtCompany} = this.state
    return (
      <div className="main-job-details-container">
        <Header />
        <div className="job-details-container">
          {this.renderJobdetailsView()}
        </div>
      </div>
    )
  }
}

export default JobDetails
