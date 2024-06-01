import {IoStar} from 'react-icons/io5'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobCard = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = jobDetails
  return (
    <li className="similar-job-card-item-container">
      <div className="heading-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
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
      <h1 className="description-heading-text">Description</h1>
      <p className="description-text">{jobDescription}</p>
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
    </li>
  )
}

export default SimilarJobCard
