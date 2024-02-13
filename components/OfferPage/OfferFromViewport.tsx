import { setOfferButtonClick } from "@/redux/reducers/mapReducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { BiSolidOffer } from "react-icons/bi";
import { handleNearByOffers } from "@/redux/actions/offerAction";
const OfferFromViewport = () => {
  const dispatch = useAppDispatch();
  const [latitude, setLatitude] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<string | null>(null);
  const isOfferButtonClicked = useAppSelector(
    (state) => state.map.offerButtonClick
  );
  // const [buttonClicked, setButtonClicked] = useState(false);

  const offerButtonClick: any = useAppSelector(
    (state) => state?.map?.offerButtonClick
  );

  useEffect(() => {
    const hash = window.location.hash;
    const [, lat, lon] = hash.split("/");
    setLatitude(lat);
    setLongitude(lon);
  }, [isOfferButtonClicked]);

  const clickedIcon = () => {
    // Check if latitude and longitude are available
    if (latitude !== null && longitude !== null) {
      // Dispatch your action with latitude and longitude
      const lat = latitude;
      const lng = longitude;
      dispatch(handleNearByOffers([lat, lng]));
      const newState = !offerButtonClick;
      dispatch(setOfferButtonClick(newState));
    } else {
      console.error("Latitude or longitude is not available.");
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        right: "0px",
        top: "215px",
        cursor: "pointer",
      }}
    >
      <div
        onClick={() => clickedIcon()}
        className="color-changing-offers"
        style={{
          color: offerButtonClick ? "red" : "black",
          fontSize: "32px",
          borderRadius: "50%",
          width: "fit-content",
          margin: "10px",
          display: "inline-block",
        }}
      >
        <Tooltip
          placement="left"
          title="Offers near me!"
          color="rgba(0, 0, 0, .8)"
        >
          <BiSolidOffer />
        </Tooltip>
      </div>
    </div>
  );
};

export default OfferFromViewport;
