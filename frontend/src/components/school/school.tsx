import React from 'react';
import './school.css';

interface SchoolComponentProps {
  schoolName: string;
  address: string;
  schoolType: string;
  tree: string;
  flower: string;
  logoLink: string;
  collection: boolean;
}

const SchoolComponent: React.FC<SchoolComponentProps> = ({
  schoolName,
  address,
  schoolType,
  tree,
  flower,
  logoLink,
  collection,
}) => {
  return (
    <div className="school-component">
      {collection ? (
        <div className="collection-view">
          <div className="logo-container">
            <img src={logoLink} alt="School Logo" className="logo" />
          </div>
          <div className="info">
            <h2 className="school-name">{schoolName}</h2>
            <p className="address">{address}</p>
          </div>
        </div>
      ) : (
        <div className="detailed-view">
          <div className="logo-container">
            <img src={logoLink} alt="School Logo" className="logo" />
          </div>
          <div className="info">
            <h2 className="school-name">{schoolName}</h2>
            <p className="address overtext">주소: {address}</p>
            <p className="details">학교구분: {schoolType}</p>
            <p className="details">교목: {tree}</p>
            <p className="details">교화: {flower}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolComponent;
