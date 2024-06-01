import {Link} from 'react-router-dom'
import {IoStar} from 'react-icons/io5'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const JobCard = props => {
  const {jobCardDetails} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobCardDetails
  const link = `/jobs/${id}`
  return (
    <li className="job-card-item-container">
      <Link to={link} className="nav-link">
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
      </Link>
      <hr className="hrs-line" />
      <h1 className="description-heading-text">Description</h1>
      <p className="description-text">{jobDescription}</p>
    </li>
  )
}

export default JobCard
