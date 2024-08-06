import '../../assets/css/Advertisement.css'

const AdvertisementColumn = () => {
    const ad1=require('../../assets/images/MEDipoj.png')
    return (
      <div className="advertisement-column">
        <h4>Advertisement</h4>
        <div className='adv-line'></div>
        <div className="ad-container">
          <img src={ad1} alt="Advertisement" />
          <div className="ad-content">
            <p>Your Online Gateway to Doctor Consultations!</p>
            <a href="https://main--melodic-dango-e0e91d.netlify.app/">Visit Site</a>
          </div>
        </div>
      </div>
    );
  };

export default AdvertisementColumn;
  