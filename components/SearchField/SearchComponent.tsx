import React, { useEffect, useState } from "react";
import { AutoComplete, Button, Input } from "antd";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  setMapData,
  setMouseEnteredMarker,
  setMultyPolygonData,
  setNearByButton,
  setNearByClickedLocation,
  setNearBySearchedLocation,
  setPolyGonData,
  setPreviouslySelectedOption,
  setPreviouslySelectedValue,
  setReverseGeoCode,
  setReverseGeoLngLat,
  setSearchedMapData,
  setSelectedIconUCode,
  setSelectedMarker,
  setSinglePolygonData,
  setUCode,
  setUCodeMarker,
} from "@/redux/reducers/mapReducer";
import {
  getSearchData,
  handleFetchNearby,
  handleGetPlacesWthGeocode,
  handleRupantorGeocode,
  handleSearchedPlaceByUcode,
  handleUsage,
  // handleUsage
} from "@/redux/actions/mapActions";
import SearchDetails from "./SearchDetails";
import ToggleButton from "../Common/ToggleButton";
import { setSelectedLocation } from "@/redux/reducers/mapReducer";
import { AiOutlineClose } from "react-icons/ai";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import "dayjs/locale/en"; // Replace 'en' with your desired locale if needed
import OffersList from "../OfferPage/OffersListCard";
import SingleOfferData from "../OfferPage/SingleOfferDataModal";

interface SearchComponentProps {
  onLocationSelect: (latitude: number, longitude: number) => void;
}

function SearchComponent({ onLocationSelect }: SearchComponentProps) {
  // next router
  const router = useRouter();
  const dispatch = useAppDispatch();

  // const place = router?.query?.place;

  // const uCodeForLink: any = useAppSelector((state) => state?.map?.uCodeForLink);
  const uCodeData: any = useAppSelector((state) => state?.map?.uCode ?? "");

  // redux state
  const searchData: any = useAppSelector((state) => state?.map?.search);
  const reverseGeoCode: any = useAppSelector(
    (state) => state?.map?.reverseGeoCode
  );
  const rupantorData: any = useAppSelector((state) => state?.map?.rupantorData);
  const reverseGeoLngLat: any = useAppSelector(
    (state) => state?.map?.reverseGeoLngLat
  );
  const uCodeMarker: any = useAppSelector((state) => state?.map?.uCodeMarker);
  const mapData: any = useAppSelector((state) => state?.map?.mapData);
  const nearByClickedLocation: any = useAppSelector(
    (state) => state?.map?.nearByClickedLocation
  );
  const previouslySelectedValue: any = useAppSelector(
    (state) => state?.map?.previouslySelectedValue
  );
  const previouslySelectedOption: any = useAppSelector(
    (state) => state?.map?.previouslySelectedOption
  );
  const offersList: any = useAppSelector((state) => state?.map?.nearByOffers);
  const offerButtonClick: any = useAppSelector(
    (state) => state?.map?.offerButtonClick
  );
  const offerData: any = useAppSelector((state: any) => state?.map?.offerData);

  const [value, setValue] = useState("");
  const handleChange = async (value: any) => {
    if (value !== previouslySelectedValue) {
      dispatch(getSearchData(value));
      dispatch(setSearchedMapData(value));
      setValue(value);
      // Reset other state values
      dispatch(setReverseGeoCode(null));
      dispatch(setNearBySearchedLocation(null));
      dispatch(setNearByClickedLocation(null));
      dispatch(setMapData(null));
      dispatch(setUCode(null));
      dispatch(setPreviouslySelectedValue(value));
    }
  };

  let isHandleSelectCalled = false;

  const handleSelect = (value: string) => {
    const selectedOption = searchData.filter(
      (option: any) => option.value === value
    );

    // Define a variable to store the previously selected option outside of the function
    // Check if the selected option is the same as the previously selected option
    if (
      selectedOption[0] &&
      selectedOption[0].id !== previouslySelectedOption
    ) {
      // For usage info
      const today = dayjs(); // This will give you the current date and time
      const formattedDate = today.format("YYYY-MM-DD"); // Outputs: "2023-08-07"
      const { address } = selectedOption[0];
      const data = { formattedDate, address, selectedOption };

      router.push("/");
      dispatch(setSearchedMapData(selectedOption[0]));
      dispatch(setMapData(selectedOption[0]));
      const { latitude, longitude } = selectedOption[0];
      onLocationSelect(latitude, longitude);
      dispatch(setReverseGeoCode(null));
      dispatch(setSelectedIconUCode(null));
      dispatch(handleUsage(data));
      dispatch(setUCode(null));
      dispatch(setUCodeMarker(null));
      dispatch(handleFetchNearby(null));
      dispatch(setNearBySearchedLocation(null));
      const lat = latitude;
      const lng = longitude;
      const dataLatLng = { lat, lng };
      dispatch(setReverseGeoLngLat(dataLatLng));
      dispatch(setNearByClickedLocation(null));
      dispatch(setNearBySearchedLocation(null));
      // nullify polygon data
      dispatch(setPolyGonData(null));
      dispatch(setSinglePolygonData(null));
      dispatch(setMultyPolygonData(null));

      // Update the previously selected option
      dispatch(setPreviouslySelectedOption(selectedOption[0]?.id));
    }
  };

  const handleKeyDown = async (event: any) => {
    if (event.key === "Enter") {
      const enteredValue = event.target.value;
      const trimmedStr = enteredValue.replace(/\s+$/, "");
      // const trimmedStrLatLng = enteredValue.replace(/\s+/g, "");
      const latLngPattern = /(-?\d+\.\d+)\s*,?\s*(-?\d+\.\d+)/;
      const latLngMatch = enteredValue.match(latLngPattern);

      if (!latLngMatch) {
        if (isHandleSelectCalled) {
          // Reset the flag and return
          isHandleSelectCalled = false;
          return;
        }
        if (trimmedStr.endsWith("near me")) {
          let latitude = reverseGeoLngLat?.lat || uCodeMarker?.uCodeOnlyLat;
          let longitude = reverseGeoLngLat?.lng || uCodeMarker?.uCodeOnlyLng;
          const data = { latitude, longitude, value: trimmedStr };
          dispatch(handleFetchNearby(data));
          dispatch(setNearByClickedLocation(null));
          dispatch(setNearByButton(value.replace("near me", "")));
        } else {
          dispatch(handleFetchNearby(null));
          const trimmedValue = trimmedStr.trim();
          const upperCaseTrimmedValue = trimmedValue.toUpperCase();
          if (upperCaseTrimmedValue.length === 8) {
            dispatch(handleSearchedPlaceByUcode(upperCaseTrimmedValue));
          } else {
            dispatch(handleRupantorGeocode(trimmedValue));
          }

          dispatch(setSelectedLocation(null));
          dispatch(setSelectedMarker(null));
          dispatch(setNearBySearchedLocation(null));
          const lat = rupantorData?.geocoded_address?.latitude;
          const lng = rupantorData?.geocoded_address?.longitude;

          const data = { lat, lng };

          dispatch(handleGetPlacesWthGeocode(data));
          if (
            rupantorData?.geocoded_address?.latitude &&
            rupantorData?.geocoded_address?.longitude
          ) {
            dispatch(setReverseGeoLngLat(data));
          }
        }
      } else {
        if (Number(latLngMatch[1]) > Number(latLngMatch[2])) {
          const lng = Number(latLngMatch[1]);
          const lat = Number(latLngMatch[2]);
          const data = { lat, lng };

          dispatch(handleGetPlacesWthGeocode(data));
          dispatch(setReverseGeoLngLat(data));
        } else {
          const lat = Number(latLngMatch[1]);
          const lng = Number(latLngMatch[2]);
          const data = { lat, lng };
          dispatch(handleGetPlacesWthGeocode(data));
          dispatch(setReverseGeoLngLat(data));
        }
      }
    }
  };

  useEffect(() => {
    if (rupantorData) {
      const lat = rupantorData?.geocoded_address?.latitude;
      const lng = rupantorData?.geocoded_address?.longitude;
      const data = { lat, lng };
      dispatch(handleGetPlacesWthGeocode(data));
      if (
        rupantorData?.geocoded_address?.latitude &&
        rupantorData?.geocoded_address?.longitude
      ) {
        dispatch(setReverseGeoLngLat(data));
      }
    }
  }, [rupantorData]);

  const handleClear = () => {
    setValue("");
    dispatch(setSelectedMarker(false));
    dispatch(setSearchedMapData(null));
    dispatch(setSelectedLocation(null));
    dispatch(setReverseGeoCode(null));
    dispatch(handleFetchNearby(null));
    dispatch(setNearBySearchedLocation(null));
    dispatch(setReverseGeoLngLat(null));
    dispatch(setUCodeMarker(null));
    dispatch(setNearByClickedLocation(null));
    dispatch(setNearBySearchedLocation(null));
    dispatch(handleGetPlacesWthGeocode(null));
    dispatch(setMapData(null));
    dispatch(setUCode(null));
    // nullify polygon data
    dispatch(setPolyGonData(null));
    dispatch(setSinglePolygonData(null));
    dispatch(setMultyPolygonData(null));

    dispatch(setPreviouslySelectedOption(null));
    dispatch(setPreviouslySelectedValue(null));
  };

  // autocomplete value part
  const revGeoValue = nearByClickedLocation
    ? nearByClickedLocation.business_name
    : (uCodeData && (uCodeData?.business_name || uCodeData?.Address)) ||
      (reverseGeoCode &&
        (reverseGeoCode?.place?.business_name ||
          reverseGeoCode?.place?.place_name ||
          reverseGeoCode?.place?.address ||
          reverseGeoCode?.place?.address_bn)) ||
      (mapData && (mapData?.Address || mapData?.business_name)) ||
      value;

  const mouseEntered = (lat: any, lng: any) => {
    dispatch(setMouseEnteredMarker({ latitude: lat, longitude: lng }));
  };

  return (
    <div style={{ zIndex: 9999 }} className="autocompleteSearchbarContainer">
      <div
        className="autocompleteSearchbar"
        style={{
          display: "flex",
          backgroundColor: "white",
          border: "1px solid #ccc",
          borderRadius: "50px",
        }}
      >
        <AutoComplete
          style={{ width: "100%", border: "none", zIndex: "100" }}
          className="autoCompleteSearchbar"
          options={searchData?.map((option: any) => ({
            ...option,
            label: (
              <div
                dangerouslySetInnerHTML={{ __html: option.label }}
                onMouseEnter={() =>
                  mouseEntered(option.latitude, option.longitude)
                }
                onMouseLeave={() => {
                  dispatch(setMouseEnteredMarker({}));
                }}
              />
            ),
          }))}
          onChange={handleChange}
          onSelect={handleSelect}
          onKeyDown={handleKeyDown}
          placeholder="Search in map"
          size="large"
          value={revGeoValue}
          autoFocus={true}
        ></AutoComplete>

        {((reverseGeoCode &&
          (reverseGeoCode?.place?.address ||
            reverseGeoCode?.place?.address_bn ||
            reverseGeoCode?.place?.business_name)) ||
          value) && (
          <Button
            onClick={handleClear}
            size="large"
            className="autoCompleteSearchbarButton"
            style={{ zIndex: "100" }}
          >
            <AiOutlineClose />
          </Button>
        )}
        <div style={{ borderLeft: "1px solid #ccc", zIndex: "100" }}>
          <div>
            <ToggleButton></ToggleButton>
          </div>
        </div>
      </div>

      {!offerButtonClick && <SearchDetails />}
      {offersList && offerButtonClick && <OffersList />}
      {<SingleOfferData />}
      {/* {
        place && <SearchDetails/>
      } */}
    </div>
  );
}

export default SearchComponent;
