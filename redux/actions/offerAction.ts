

import axios from "axios";
import {
  setNearByOffers,
  setOfferData,
  setSingleOfferData,

} from "../reducers/mapReducer";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { API } from "@/app.config";



export const handleOfferWithPlaceName = createAsyncThunk(
  "search/handleOfferWithPlaceName",
  async (place_code: any, { dispatch }) => {
    const headers = { headers: { Authorization: `Bearer ${ 'MjYyMzpHOVkzWFlGNjZG' }` } }
    try {
      const res = await axios.get(
        `${API.GET_PLACE_OFFER_DATA}/${place_code}`,headers
      );
        dispatch(setSingleOfferData(res?.data));
    } catch (err) {
      console.error(err);
    }
  }
);


export const handleNearByOffers = createAsyncThunk(
  "search/handleNearByOffers",
  async (data: any, { dispatch }) => {
    const headers = { headers: { Authorization: `Bearer ${ 'MjYyMzpHOVkzWFlGNjZG' }` } }
    try {
      const res = await axios.get(
        `${API.GET_NEARBY_OFFERS}?latitude=${Number(data[0])}&longitude=${Number(data[1])}`,headers
      );
        dispatch(setNearByOffers(res?.data));
    } catch (err) {
      console.error(err);
    }
  }
);

