import axios from "axios";
import {
  setGeoData,
  setPolyGonData,
  setReverseGeoCode,
  setReverseGeoLngLat,
  setSearch,
  setSearchPlaces,
  setUCode,
  setUsageData,
} from "../reducers/mapReducer";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import { API } from "@/app.config";
import { setNearBySearchedLocation } from "../reducers/mapReducer";

// function escapeRegExp(string: string) {
//   return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// }

let debounceTimeout: string | number | NodeJS.Timeout | undefined;

function addViewableAddress(data: any) {
  for (let i = 0; i < data.length; i++) {
    const place = data[i];
    if (place.pType === "Admin" && place.subType === "District") {
      place.viewable_address = `${place.district}, Bangladesh`;
    } 
    else if(place.pType === "Admin" &&  place.subType === "Sub District"){
      place.viewable_address = `${place.sub_district}, ${place.district}`;
    }
    else {
      place.viewable_address = place.address;
    }
  }
  return data;
}

export function getSearchData(value: any) {
  return async (dispatch: any) => {
    // Clear any previous debounce timeout
    clearTimeout(debounceTimeout);

    if (value) {
      // Set a new debounce timeout
      debounceTimeout = setTimeout(async () => {
        const regex = new RegExp(
          '[\u0995-\u09B9\u09CE\u09DC-\u09DF]|[\u0985-\u0994]|[\u09BE-\u09CC\u09D7]|(\u09BC)|()[০-৯]'
          );
        const matches = regex.test(value);
        try {
          const response = await axios.get(
            matches === false
              ? `${API.AUTOCOMPLETE}${value}`
              : `${API.AUTOCOMPLETE}${value}&bangla=true`
          );
          const results: any[] = response?.data?.places;
          const ViewableAddress = addViewableAddress(results)
          const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

          const newOptions: any = results?.map((result: any) => {
            const formattedAddress = result.viewable_address.replace(
              new RegExp(escapedValue, 'gi'),
              (match: any) => `<b>${match}</b>`
            );

            return {
              ...result,
              key: result.id,
              value: result.viewable_address,
              label: formattedAddress,
              longitude: Number(result.longitude),
              latitude: Number(result.latitude),
            };
          });
          dispatch(setSearch(newOptions));
        } catch (error) {
          console.error(error);
        }
      }, 240); // Adjust the debounce delay as needed
    } else {
      dispatch(setSearch([]));
    }
  };
}



// For Distance Matrix Searchbar
export const handleSearchPlaces = createAsyncThunk(
  "search/searchPlaces",
  async (value: any, { dispatch }) => {
    try {
      const res = await axios.get(`${API.AUTOCOMPLETE}${value}`);
      const results: any[] = res?.data?.places;
      const newOptions: any = results?.map((result: any) => ({
        ...result,
        key: result?.id,
        value: result?.address,
        label: result?.address,
        longitude: Number(result?.longitude),
        latitude: Number(result?.latitude),
      }));

      dispatch(setSearchPlaces(newOptions));
    } catch (err) {
      console.error(err);
      message.error({ content: "Failed to get data !" });
    }
  }
);

// For selecting single data from autocomplete responses
export const handleMapData = createAsyncThunk(
  "search/mapData",
  async (data: any, { dispatch }) => {
    try {
      const headers = { headers: { Authorization: `Bearer ${ 'MjYyMzpHOVkzWFlGNjZG' }` } }
      // const res = await axios.get(`${API.SEARCH_BY_CODE}${data}`);
      const res = await axios.get(`${ API.SEARCH_BY_CODE }/${ data }`, headers);
      // await axios.get(`${ API.USER_TRANSACTION }`, { headers: { Authorization: `Bearer ${ token }` }, params: options?.params, signal: options?.signal })

      try {
        const dataformap = await axios.get(
          `${API.REVERSE_GEO}latitude=${ res.data.latitude }&longitude=${ res.data.longitude }`, headers
        );
        dispatch(setReverseGeoCode( dataformap?.data ));
        
        if(dataformap?.data?.place?.type==='Admin'){
          try {
            const polyGonArea= await axios.get(
              `https://elastic.bmapsbd.com/test/autocomplete/search?q=${dataformap?.data?.place?.place_code}`
            );
            dispatch(setPolyGonData(polyGonArea?.data?.places[0]?.bounds));
          } catch (err) {
            console.error(err);
          }
        }
      } catch (err) {
        console.error(err);
      }

    } catch (err) {
      console.error(err);
    }
  }
);

export const handleDistanceForCar = createAsyncThunk(
  "search/searchPlaces",
  async (data: any, { dispatch }) => {
    const { selectLocationFrom, selectLocationTo } = data;
    try {
      const res = await axios.get(
        `https://geoserver.bmapsbd.com/gh/route?point=${ selectLocationFrom?.latitude },${ selectLocationFrom?.longitude }&point=${ selectLocationTo?.latitude },${ selectLocationTo?.longitude }&locale=en-us&elevation=false&profile=car&optimize=%22true%22&use_miles=false&layer=Barikoi&points_encoded=false`
      );
      dispatch(setGeoData( res?.data ));
    } catch (err) {
      console.error(err);
    }
  }
);

export const handleDistanceForBike = createAsyncThunk(
  "search/searchPlaces",
  async (data: any, { dispatch }) => {
    const { selectLocationFrom, selectLocationTo } = data;
    try {
      const res = await axios.get(
        `https://geoserver.bmapsbd.com/gh/route?point=${selectLocationFrom?.latitude},${selectLocationFrom?.longitude}&point=${selectLocationTo?.latitude},${selectLocationTo?.longitude}&locale=en-us&elevation=false&profile=bike&optimize=%22true%22&use_miles=false&layer=Barikoi&points_encoded=false&ch.disable=true`
      );
      dispatch(setGeoData(res?.data));
    } catch (err) {
      console.error(err);
    }
  }
);

export const handleDistanceForMotorCycle = createAsyncThunk(
  "search/searchPlaces",
  async (data: any, { dispatch }) => {
    const { selectLocationFrom, selectLocationTo } = data;
    try {
      const res = await axios.get(
        `https://geoserver.bmapsbd.com/gh/route?point=${selectLocationFrom?.latitude},${selectLocationFrom?.longitude}&point=${selectLocationTo?.latitude},${selectLocationTo?.longitude}&locale=en-us&elevation=false&profile=motorcycle&optimize=%22true%22&use_miles=false&layer=Barikoi&points_encoded=false&ch.disable=true`
      );
      dispatch(setGeoData(res?.data));
    } catch (err) {
      console.error(err);
    }
  }
);

export const handleGetPlacesWthGeocode = createAsyncThunk(
  "search/searchPlacesWithGeocode",
  async (data: any, { dispatch }) => {
    const { lat, lng } = data;
    const headers = { headers: { Authorization: `Bearer ${ 'MjYyMzpHOVkzWFlGNjZG' }` } }
    try {
      const res = await axios.get(
        `${API.REVERSE_GEO}latitude=${lat}&longitude=${lng}`,headers
      );
      dispatch(setReverseGeoCode(res?.data));
      if(res?.data?.place?.type==='Admin' && res?.data?.place?.place_code!== null){
        try {
          const polyGonArea= await axios.get(
            `https://elastic.bmapsbd.com/test/autocomplete/search?q=${res.data.place.place_code}`
          );
          dispatch(setPolyGonData(polyGonArea.data.places[0].bounds));
        } catch (err) {
          console.error(err);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
);

// Search By UCode

export const handleSearchedPlaceByUcode = createAsyncThunk(
  "search/searchPlaceByUcode",
  async (data: any, { dispatch }) => {
    try {
      // const token = localStorage.getItem('admin_token');
      const headers = { headers: { Authorization: `Bearer ${ 'MjYyMzpHOVkzWFlGNjZG' }` } }
      // const res = await axios.get(`${API.SEARCH_BY_CODE}${data}`);
      const res = await axios.get(`${ API.SEARCH_BY_CODE }/${ data }`, headers)

      dispatch(setUCode(res?.data));
      try {
        const dataforucode = await axios.get(
          `${API.REVERSE_GEO}latitude=${res.data.latitude}&longitude=${res.data.longitude}`,headers
        );
        dispatch(setReverseGeoCode(dataforucode?.data));
        const data = {lat:res.data.latitude, lng:res.data.longitude}
        dispatch(setReverseGeoLngLat(data));
      if(dataforucode?.data?.place?.type==='Admin'){
        try {
          const polyGonArea= await axios.get(
            `https://elastic.bmapsbd.com/test/autocomplete/search?q=${dataforucode.data.place_code}`
          );
          dispatch(setPolyGonData(polyGonArea.data.places[0].bounds));
        } catch (err) {
          console.error(err);
        }
      }
      } catch (err) {
        console.error(err);
      }
    } catch (err) {

      // If get Error in UCODE then Call rupantor
      try {
        let formData = new FormData();
        formData.append("q", data);
  
        const response = await fetch(`${API.RUPANTOR}`, {
          method: "post",
          body: formData,
        });
  
        if (!response.ok) {
          // Handle non-2xx responses here
          throw new Error(`Request failed with status: ${response.status}`);
        }
  
        const responseData = await response.json();
        const headers = { headers: { Authorization: `Bearer ${ 'MjYyMzpHOVkzWFlGNjZG' }` } }
        try {
          const dataforucode = await axios.get(
            `${API.REVERSE_GEO}latitude=${responseData.geocoded_address.latitude}&longitude=${responseData.geocoded_address.longitude}`,headers
          );
          dispatch(setReverseGeoCode(dataforucode?.data));
          const data= {lat:responseData.geocoded_address.latitude, lng:responseData.geocoded_address.longitude};
          dispatch(setReverseGeoLngLat(data))
        } catch (err) {
          console.error(err);
        }
      } catch (error) {
        console.error("Error:", error);
        // You can dispatch an action here to handle the error state if needed
      }
    }
  }
);

export const handleRupantorGeocode = createAsyncThunk(
  "search/searchPlaceByUcode",
  async (data: any, { dispatch }) => {
    try {
      let formData = new FormData();
      formData.append("q", data);

      const response = await fetch(`${API.RUPANTOR}`, {
        method: "post",
        body: formData,
      });

      if (!response.ok) {
        // Handle non-2xx responses here
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const responseData = await response.json();
      const headers = { headers: { Authorization: `Bearer ${ 'MjYyMzpHOVkzWFlGNjZG' }` } }
      try {
        const dataforucode = await axios.get(
          `${API.REVERSE_GEO}latitude=${responseData.geocoded_address.latitude}&longitude=${responseData.geocoded_address.longitude}`,headers
        );
        dispatch(setReverseGeoCode(dataforucode?.data));
        const data= {lat:responseData.geocoded_address.latitude, lng:responseData.geocoded_address.longitude};
        dispatch(setReverseGeoLngLat(data))
      } catch (err) {
        console.error(err);
      }
    } catch (error) {
      console.error("Error:", error);
      // You can dispatch an action here to handle the error state if needed
    }
  }
);

//  For usage part when a person click on autocomplete value
export const handleUsage = createAsyncThunk(
  "search/handleUsage",
  async (data: any, { dispatch }) => {
    const formattedData = JSON.stringify(data.selectedOption, null, 2);
    let formData = new FormData();
    formData.append("date", data.formattedDate);
    formData.append("q", data.address);
    formData.append("geo_info", formattedData);

    // const headers = { headers: { Authorization: `Bearer ${ 'MjYyMzpHOVkzWFlGNjZG' }` } }
    fetch(`${API.USAGE_DATA}`, {
      method: "post",
      body: formData,
      // ...headers,
    })
      .then((response) => response.json())
      // .then((response) => dispatch(setUsageData(response)))
      .then((response) => dispatch(setUsageData(response)))
      .catch((error) => console.error("Error:", error))
  }
);

// nearby part
const fetchData = async (value: any, dispatch: any) => {
  const latitude = value.latitude;
  const longitude = value.longitude;
  const q = value.value;
  const url = `${API.NEARBY_URL}`;
  const payload = new URLSearchParams();
  payload.append("latitude", latitude);
  payload.append("longitude", longitude);
  payload.append("q", q);

  if (!latitude || !longitude) {
    return;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      body: payload,
    });
    const data = await response.json();

    dispatch(setNearBySearchedLocation(data));
  } catch (error) {
    console.error("Error:", error);
  }
};

export const handleFetchNearby = createAsyncThunk(
  "search/fetchNearby",
  async (data: any, { dispatch }) => {
    const { longitude, latitude, value } = data;
    try {
      await fetchData({ longitude, latitude, value }, dispatch);
    } catch (err) {
      console.error(err);
    }
  }
);
