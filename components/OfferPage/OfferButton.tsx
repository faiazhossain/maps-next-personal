import React, { useEffect, useState } from 'react';
import { Button, Modal, Card, Divider, Badge, Image } from 'antd'; // Import necessary components from Ant Design
import { BiSolidOffer } from 'react-icons/bi';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { handleNearByOffers, handleOfferWithPlaceName } from '@/redux/actions/offerAction';
import { setIsOfferModalVisible, setOfferButtonClick, setOfferData, setSingleOfferModalOpen } from '@/redux/reducers/mapReducer';

const OfferButton: React.FC = () => {
  const dispatch = useAppDispatch();

  const reverseGeoCode: any = useAppSelector(
    (state: any) => state?.map?.reverseGeoCode
  );

  // Create a function to show the modal when the button is clicked
  const getData = () => {
    //dispatch the button tO get the offer
    // dispatch(handleOfferWithPlaceName(reverseGeoCode.place.place_code));
    // dispatch(handleNearByOffers([reverseGeoCode.place.latitude,reverseGeoCode.place.longitude]));
    dispatch(handleOfferWithPlaceName(reverseGeoCode?.place?.place_code))
    // dispatch(setIsOfferModalVisible(true));
    dispatch(setSingleOfferModalOpen(true))
    // dispatch(setOfferButtonClick(true))
    // dispatch(setOfferData(nearByOffers?.data[index]))
  };

  return (
    <div>
      <Divider></Divider>
      <div onClick={getData} style={{position:'relative'}} className="order2stepbutton">
        <div >
          <p className="elbutton">
              <span className="elbuttonmain">Available Offers!</span>
          </p>
          <div style={{position:'absolute',fontSize:'27px',top:-14,right:-7, color:'#363062'}}>
            <BiSolidOffer></BiSolidOffer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferButton;
