import maplibregl, { Hash } from "maplibre-gl";
import React, { useEffect, useMemo, useState } from "react";
import {
  Layer,
  Map,
  Marker,
  NavigationControl,
  Source,
  useControl,
  Popup,
  GeolocateControl,
} from "react-map-gl";
import _debounce from "lodash/debounce";
const wkt = require("wkt");
const { parse } = require("wkt");
// // Importing CSS
import {
  setGeoData,
  setMapData,
  setMapStyle,
  setMapVisibility,
  setNearByClickedLocation,
  setNearBySearchedLocation,
  setReverseGeoLngLat,
  setRupantorData,
  setSearchedMapData,
  setSelectLocationFrom,
  setSelectLocationTo,
  setSelectedLocation,
  setSelectedMarker,
  setToggleDistanceButton,
  setUCode,
  setUCodeMarker,
  setSingleMapillaryData,
  setImgId,
  setScatterData,
  setPolyGonData,
  setSinglePolygonData,
  setMultyPolygonData,
  setPreviouslySelectedOption,
  setPreviouslySelectedValue,
  setIsOfferModalVisible,
  setOfferData,
} from "@/redux/reducers/mapReducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import "maplibre-gl/dist/maplibre-gl.css";
import SearchComponent from "../SearchField/SearchComponent";

import {
  GeoJsonLayer,
  IconLayer,
  TextLayer,
  PolygonLayer,
  ScatterplotLayer,
} from "@deck.gl/layers/typed";

import { Col, Image, Row } from "antd";

import {
  handleFetchNearby,
  handleGetPlacesWthGeocode,
  handleSearchedPlaceByUcode,
} from "@/redux/actions/mapActions";
import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox/typed";
import { PathStyleExtension } from "@deck.gl/extensions";
import { bbox } from "@turf/turf";
import { useRouter } from "next/router";

// import constants
import DistanceSearch from "../Distance/DistanceSearch";
import MapLayer from "../Layer/MapLayer";
import SwitchButton from "../Common/SwitchButton";
import MapillaryViewer from "../Common/MapillaryView";
import { handleNearByOffers } from "@/redux/actions/offerAction";
import OfferFromViewport from "../OfferPage/OfferFromViewport";

// for deckgl overlay
const DeckGLOverlay = (props) => {
  const overlay = useControl(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
};

const MainMap = () => {
  // getting map
  const mapRef = React.createRef();
  // from router
  const router = useRouter();

  const uCode = router?.query?.place;
  // redux dispatch
  const dispatch = useAppDispatch();
  // redux state data
  const selectedLocation = useAppSelector(
    (state) => state?.map?.selectedLocation ?? null
  );
  const toggleDistanceButton = useAppSelector(
    (state) => state?.map?.toggleDistanceButton ?? null
  );
  const selectLocationFrom = useAppSelector(
    (state) => state?.map?.selectLocationFrom ?? null
  );
  const selectLocationTo = useAppSelector(
    (state) => state?.map?.selectLocationTo ?? null
  );
  const nearBySearchedData = useAppSelector(
    (state) => state?.map?.nearBySearchedLocation ?? null
  );

  const offersList = useAppSelector((state) => state?.map?.nearByOffers);
  const offerData = useAppSelector((state) => state?.map?.offerData);
  const offerButtonClick = useAppSelector(
    (state) => state?.map?.offerButtonClick
  );

  const selectedMapLayer = useAppSelector((state) => state?.map?.mapLayer);
  const mapStyle = useAppSelector((state) => state?.map?.mapStyle ?? null);
  const uCodeOnly = useAppSelector((state) => state?.map?.uCode ?? null);
  const reverseGeoLngLat = useAppSelector(
    (state) => state?.map?.reverseGeoLngLat
  );
  const revGeoData = useAppSelector((state) => state?.map?.reverseGeoCode);
  const mapVisibility = useAppSelector((state) => state?.map?.mapVisibility);
  const nearByClickedLocationData = useAppSelector(
    (state) => state?.map?.nearByClickedLocation
  );

  const onHoverMarkerData = useAppSelector(
    (state) => state?.map?.mouseEnteredMarker
  );
  const geoData = useAppSelector((state) => state?.map?.geoData ?? null);
  const uCodeData = useAppSelector((state) => state?.map?.uCode ?? null);
  const polygonData = useAppSelector(
    (state) => state?.map?.polyGonData ?? null
  );
  const singlePolygonData = useAppSelector(
    (state) => state?.map?.singlePolygonData ?? null
  );
  const multyPolygonData = useAppSelector(
    (state) => state?.map?.multyPolygonData ?? null
  );
  const mapillaryData = useAppSelector(
    (state) => state?.map?.mapillaryData ?? null
  );
  const singleMapillaryData = useAppSelector(
    (state) => state?.map?.singleMapillaryData ?? null
  );
  const scatterData = useAppSelector(
    (state) => state?.map?.scatterData ?? null
  );
  const imgId = useAppSelector((state) => state?.map?.imgId ?? null);

  const [showPopup, setShowPopup] = useState(true);

  // on select getting location latitude and longitude
  const handleLocationSelect = (latitude, longitude) => {
    const lngLat = { latitude, longitude };
    dispatch(setSelectedLocation(lngLat));
    dispatch(setSelectedMarker(true));
  };

  // State: 3d model State
  const [sohidMinar, setSohidMinarLayer] = useState(null);
  const [sritiSoudho, setSritiSoudhoLayer] = useState(null);
  const [parliament, setParliamentLayer] = useState(null);
  const [padmaBridge, setPadmaBridge] = useState(null);

  // Map style
  useEffect(() => {
    fetch(selectedMapLayer)
      .then((response) => response.json())
      .then((data) => {
        // localStorage.setItem('admin_token', 'MjYyMzpHOVkzWFlGNjZG');
        const availableOpenMapData = data?.layers?.filter(
          (layer) => layer.id && layer["source-layer"] === "barikoi_poi"
          // (layer) => layer.id && layer["source-layer"] === ("poi")
        );
        // availableOpenMapData[10].paint['text-color']='red';

        availableOpenMapData.forEach((layer) => {
          if (
            layer.minzoom === 13 ||
            layer.minzoom === 14 ||
            layer.minzoom === 15
          ) {
            layer.minzoom = 8;
          }
        });

        dispatch(setMapStyle(data));
      })
      .catch((error) => console.error(error));
  }, [selectedMapLayer]);

  // fly to the selected location when it changes
  useEffect(() => {
    const { longitude, latitude, lat, lng } =
      selectedLocation || reverseGeoLngLat || uCodeData || {};

    if (selectedLocation || reverseGeoLngLat || uCodeData) {
      mapRef?.current?.flyTo({
        center: [longitude || lng, latitude || lat],
        zoom: 18,
        curve: 1,
      });
    }
    // }, [selectedLocation, reverseGeoLngLat, toggleDistanceButton, uCodeData]);
    // }, [selectedLocation, reverseGeoLngLat, toggleDistanceButton, uCodeData]);
  }, [selectedLocation, !selectedLocation && reverseGeoLngLat, uCodeData]);

  // Fly to clicked offer

  // Fly to clicked offer
  useEffect(() => {
    const { longitude, latitude } = offerData || {};
    if (offerData && offerButtonClick) {
      mapRef?.current?.flyTo({
        center: [longitude || lng, latitude || lat],
        zoom: 18,
        curve: 1,
      });
    }
    // }, [selectedLocation, reverseGeoLngLat, toggleDistanceButton, uCodeData]);
    // }, [selectedLocation, reverseGeoLngLat, toggleDistanceButton, uCodeData]);
  }, [offerData]);

  const geoJsonData =
    geoData?.paths?.length > 0 ? geoData?.paths[0]?.points : null;

  let markerIcon;
  let markerData;

  if (!selectLocationFrom && !selectLocationTo) {
    markerIcon = [];
  } else {
    markerData = [selectLocationFrom, selectLocationTo];
  }

  // getting marker icon on layer
  markerIcon = useMemo(() => {
    return markerData?.map((marker) => ({
      ...marker,
      iconUrl:
        marker?.pointType === "From"
          ? "/destination_marker.png"
          : "/marker.png",
      value: marker?.value,
    }));
  }, [markerData]);

  // // Polygon layer data filter
  // // Polygon layer data filter

  useEffect(() => {
    if (polygonData) {
      const dataGot = wkt.parse(polygonData);
      if (dataGot?.type === "Polygon") {
        dispatch(setMultyPolygonData(null));
        dispatch(setSinglePolygonData(dataGot?.coordinates));
      } else {
        dispatch(setMultyPolygonData(dataGot?.coordinates));
        dispatch(setSinglePolygonData(null));
      }
    }
  }, [polygonData]);

  const transformedDataPolygon =
    revGeoData && singlePolygonData
      ? [
          {
            contour: singlePolygonData,
          },
        ]
      : revGeoData;

  const multytransformedDataPolygon = revGeoData
    ? multyPolygonData?.flatMap((data) => ({
        contour: data,
      }))
    : revGeoData;

  useEffect(() => {
    if (imgId) {
      fetch(
        `https://graph.mapillary.com/${imgId}?access_token=MLY|9965372463534997|6cee240fad8e5571016e52cd3f24d7f8&fields=computed_geometry`
      )
        .then((response) => response.json())
        .then((data) => {
          // dispatch(setScatterData(data.computed_geometry.coordinates));
          dispatch(setScatterData(data.computed_geometry?.coordinates));
        })
        .catch((error) => console.error(error));
    }
  }, [imgId]);
  useEffect(() => {
    if (imgId) {
      fetch(
        `https://graph.mapillary.com/${imgId}?access_token=MLY|9965372463534997|6cee240fad8e5571016e52cd3f24d7f8&fields=computed_geometry`
      )
        .then((response) => response.json())
        .then((data) => {
          // dispatch(setScatterData(data.computed_geometry.coordinates));
          dispatch(setScatterData(data.computed_geometry?.coordinates));
        })
        .catch((error) => console.error(error));
    }
  }, [imgId]);

  const modifiedScatterData = [{ coordinates: scatterData }];

  // distance matrix layers
  const layers = [
    new GeoJsonLayer({
      id: "geojson-layer1",
      data: geoJsonData,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: true,
      pointType: "circle",
      lineWidthScale: 20,
      lineWidthMaxPixels: 8,
      lineWidthMinPixels: 6,
      // strokeColor: [55, 103, 210],
      getLineColor: [55, 103, 210],
      getPointRadius: 100,
      getLineWidth: 4,
      getElevation: 30,
      wireframe: true,
    }),

    new GeoJsonLayer({
      id: "geojson-layer2",
      data: geoJsonData,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: true,
      pointType: "circle",
      lineWidthScale: 20,
      lineWidthMaxPixels: 5,
      lineWidthMinPixels: 3,
      getLineColor: [44, 176, 254],
      getPointRadius: 100,
      getLineWidth: 4,
      getElevation: 30,
      wireframe: true,
    }),

    new IconLayer({
      id: "IconLayer",
      data: markerIcon,
      getColor: (d) => [219, 0, 91],
      getIcon: (d) => ({
        url: d?.iconUrl,
        width: 60,
        height: 60,
        anchorY: 10,
        zIndex: 99,
      }),
      getPosition: (d) => [+d?.longitude, +d?.latitude],
      getSize: (d) => 5,
      sizeScale: 6,
      pickable: true,
      lineWidthScale: 20,
      lineWidthMinPixels: 2,
    }),

    new TextLayer({
      id: "text-layer",
      data: markerIcon,
      pickable: true,
      getPosition: (d) => [+d?.longitude, +d?.latitude],
      getText: (d) => {
        const words = d.value?.split(" ");
        const firstTwoWords = words?.slice(0, 3).join(" ");
        return firstTwoWords;
      },
      getColor: [55, 103, 210],
      getSize: 16,
      getAngle: 15,
      getTextAnchor: "start",
      getAlignmentBaseline: "top",
      backgroundPadding: [100, 0, 0, 100],
      getPixelOffset: [14, 0],
    }),

    new ScatterplotLayer({
      id: "scatterplot-layer",
      data: modifiedScatterData,
      pickable: true,
      opacity: 1,
      stroked: true,
      filled: true,
      radiusScale: 20,
      // getElevation:30,
      // radiusUnits:20,
      // lineWidthScale:20,
      radiusMinPixels: 1,
      radiusMaxPixels: 8,
      lineWidthMaxPixels: 1,
      // lineWidthMinPixels: .5,
      getPosition: (d) => d.coordinates,
      getRadius: (d) => Math.sqrt(d.exits),
      getFillColor: (d) => [255, 140, 0],
      getLineColor: (d) => [0, 0, 0],
    }),

    new PolygonLayer({
      id: "polygon-layer2",
      data: multytransformedDataPolygon,
      pickable: true,
      stroked: true,
      filled: true,
      wireframe: true,
      lineWidthMinPixels: 1,
      getPolygon: (d) => d.contour,
      getElevation: (d) => d.population / d.area / 10,
      getFillColor: [255, 255, 255, 40],
      getLineColor: [255, 0, 0],
      getLineWidth: 6,
      extruded: false,
      getDashArray: [5, 3],
      dashJustified: true,
      dashGapPickable: true,
      extensions: [new PathStyleExtension({ dash: true })],
    }),

    new PolygonLayer({
      id: "polygon-layer1",
      data: transformedDataPolygon,
      pickable: true,
      stroked: true,
      filled: true,
      wireframe: true,
      lineWidthMinPixels: 1,
      getPolygon: (d) => d.contour,
      // getElevation: d => d.population / d.area / 10,
      getFillColor: [255, 255, 255, 40],
      getLineColor: [255, 0, 0],
      getLineWidth: 6,
      extruded: false,
      getDashArray: [5, 3],
      dashJustified: true,
      dashGapPickable: true,
      extensions: [new PathStyleExtension({ dash: true })],
    }),
  ];

  // For setting mappillary ID on click
  // const [singleMapillaryData, setSingleMapillaryData]= useState(null);

  const handleClick = (e) => {
    dispatch(setPreviouslySelectedOption(null));
    dispatch(setPreviouslySelectedValue(null));
    if (mapillaryData) {
      // Query for mapillary features
      const mapillaryFeatures = e.target.queryRenderedFeatures(e.point, {
        layers: ["mapillary-images"], // Specify the layers you want to query
      });

      // Check if there are mapillary features and the first feature has an "id" property
      if (
        mapillaryFeatures.length > 0 &&
        mapillaryFeatures[0]?.properties?.id
      ) {
        // Dispatch actions if the conditions are met
        dispatch(setSingleMapillaryData(mapillaryFeatures[0]?.properties?.id));
        dispatch(setImgId(null));
      }
    } else {
      const features = mapRef?.current?.queryRenderedFeatures(e.point);

      if (features?.length > 0) {
        // Do something with the clicked feature's properties
        const properties = features[0]?.properties;
        if (properties.place_code) {
          if (uCode) {
            router.push("/");
          }
          dispatch(setNearBySearchedLocation(null));
          dispatch(setSearchedMapData(null));
          dispatch(setSelectedLocation(null));
          dispatch(setToggleDistanceButton(true));
          dispatch(setRupantorData(null));
          // nullify polygon data
          dispatch(setPolyGonData(null));
          dispatch(setSinglePolygonData(null));
          dispatch(setMultyPolygonData(null));
          const lat = e?.lngLat?.lat;
          const lng = e?.lngLat?.lng;
          const data = { lat, lng };

          const uCodeOnlyLat = e?.lngLat?.lat;
          const uCodeOnlyLng = e?.lngLat?.lng;
          const latNdLng = { uCodeOnlyLng, uCodeOnlyLat };
          // dispatch(setUCodeMarker(latNdLng));
          dispatch(setUCodeMarker(latNdLng));
          dispatch(handleFetchNearby(data));
          // dispatch(handleFetchNearby(null));
          dispatch(handleSearchedPlaceByUcode(properties.place_code));
          dispatch(setSelectedLocation(null));
          dispatch(setMapVisibility(true));
          dispatch(setSelectLocationFrom(null));
          dispatch(setSelectLocationTo(null));
          dispatch(setGeoData(null));
          dispatch(setNearByClickedLocation(null));
          dispatch(setMapData(null));
          dispatch(setNearBySearchedLocation(null));
          dispatch(setReverseGeoLngLat(data));
          // dispatch(setPolyGonData(null));
        }
      }
    }
  };

  // On Double Click

  const handleDoubleClick = (e) => {
    const features = mapRef?.current?.queryRenderedFeatures(e.point);
    const properties = features[0]?.source;
    dispatch(setPreviouslySelectedOption(null));
    dispatch(setPreviouslySelectedValue(null));
    if (properties === "admin") {
      const lat = e?.lngLat?.lat;
      const lng = e?.lngLat?.lng;
      const data = { lat, lng };
      // dispatch(setUCode(properties.ucode))
      dispatch(setReverseGeoLngLat(data));
      dispatch(setUCodeMarker(null));
      dispatch(handleGetPlacesWthGeocode(data));
      dispatch(handleGetPlacesWthGeocode(null));
      dispatch(setUCode(null));
      dispatch(handleFetchNearby(data));
      dispatch(handleFetchNearby(null));
      // dispatch(handleSearchedPlaceByUcode(null));
      dispatch(setSelectedLocation(null));
      dispatch(setMapVisibility(true));
      dispatch(setSelectLocationFrom(null));
      dispatch(setSelectLocationTo(null));
      dispatch(setGeoData(null));
      dispatch(setNearByClickedLocation(null));
      dispatch(setMapData(null));
      dispatch(setNearBySearchedLocation(null));
      // nullify polygon data
      dispatch(setPolyGonData(null));
      dispatch(setSinglePolygonData(null));
      dispatch(setMultyPolygonData(null));
    } else {
      const lat = e?.lngLat?.lat;
      const lng = e?.lngLat?.lng;
      const data = { lat, lng };
      // dispatch(setUCode(properties.ucode))
      dispatch(setReverseGeoLngLat(data));
      dispatch(setUCodeMarker(null));
      dispatch(handleGetPlacesWthGeocode(data));
      dispatch(handleGetPlacesWthGeocode(null));
      dispatch(setUCode(null));
      dispatch(handleFetchNearby(data));
      dispatch(handleFetchNearby(null));
      // dispatch(handleSearchedPlaceByUcode(null));
      dispatch(setSelectedLocation(null));
      dispatch(setMapVisibility(true));
      dispatch(setSelectLocationFrom(null));
      dispatch(setSelectLocationTo(null));
      dispatch(setGeoData(null));
      dispatch(setNearByClickedLocation(null));
      dispatch(setMapData(null));
      dispatch(setNearBySearchedLocation(null));
      // nullify polygon data
      dispatch(setPolyGonData(null));
      dispatch(setSinglePolygonData(null));
      dispatch(setMultyPolygonData(null));
    }
  };

  // on getting ucode
  useEffect(() => {
    if (uCode) {
      dispatch(handleSearchedPlaceByUcode(uCode));
      dispatch(setNearBySearchedLocation(null));
    }
  }, [uCode]);

  const uCodeOnlyLng = uCodeOnly?.longitude ? uCodeOnly?.longitude : "";
  const uCodeOnlyLat = uCodeOnly?.latitude ? uCodeOnly?.latitude : "";
  const latNdLng = { uCodeOnlyLng, uCodeOnlyLat };
  // Fitbounds
  const _onFitBounds = (
    data,
    jsonData,
    nearBySearchedData,
    polygonData,
    singlePolygonData,
    multyPolygonData,
    nearByOffers
  ) => {
    const map = mapRef.current;
    if (data) {
      const geoJsonPoints = {
        type: "FeatureCollection",
        features: [],
      };
      data?.forEach((d) => {
        geoJsonPoints?.features?.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [d?.longitude, d?.latitude],
          },
        });
      });
      const [minLng, minLat, maxLng, maxLat] = bbox(geoJsonPoints);

      if (map && map !== null) {
        map?.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          {
            padding: 140,
            duration: 1000,
            maxZoom: 16,
          }
        );
      }
      return;
    }

    // For single polygon layer fitbounds

    if (polygonData && singlePolygonData) {
      const geoJsonPoints = {
        type: "FeatureCollection",
        features: [],
      };
      singlePolygonData[0]?.forEach((d) => {
        geoJsonPoints?.features?.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [d[0], d[1]],
          },
        });
      });
      const [minLng, minLat, maxLng, maxLat] = bbox(geoJsonPoints);
      if (map && map !== null) {
        map?.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          {
            padding: 140,
            duration: 1000,
            maxZoom: 16,
          }
        );
      }
      return;
    }

    // For multy polygon layer fitbounds

    if (polygonData && multyPolygonData) {
      const geoJsonPoints = {
        type: "FeatureCollection",
        features: [],
      };

      multyPolygonData
        .flatMap((data) => data[0])
        ?.forEach((d) => {
          geoJsonPoints?.features?.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [d[0], d[1]],
            },
          });
        });
      const [minLng, minLat, maxLng, maxLat] = bbox(geoJsonPoints);

      if (map && map !== null) {
        map?.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          {
            padding: 140,
            duration: 1000,
            maxZoom: 16,
          }
        );
      }
      return;
    }

    if (nearBySearchedData && nearBySearchedData?.places?.length > 0) {
      const geoJsonPoints = {
        type: "FeatureCollection",
        features: [],
      };
      nearBySearchedData?.places?.forEach((d) => {
        geoJsonPoints?.features?.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [d?.geo_location?.[0], d?.geo_location?.[1]],
          },
        });
      });
      const [minLng, minLat, maxLng, maxLat] = bbox(geoJsonPoints);
      if (map && map !== null) {
        map?.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          {
            padding: 140,
            duration: 1000,
            maxZoom: 16,
          }
        );
      }
      return;
    }

    if (jsonData) {
      const [minLng, minLat, maxLng, maxLat] = bbox(jsonData);

      if (map && map !== null) {
        map?.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          {
            padding: 140,
            duration: 1000,
            maxZoom: 16,
          }
        );
      }
    }
  };
  offersList;
  useEffect(() => {
    _onFitBounds(
      markerData,
      geoJsonData,
      nearBySearchedData,
      polygonData,
      singlePolygonData,
      multyPolygonData,
      offersList,
      showPopup
    );
  }, [
    polygonData,
    geoData,
    markerData,
    geoJsonData,
    nearBySearchedData,
    nearByClickedLocationData,
    singlePolygonData,
    multyPolygonData,
    offersList,
    showPopup,
  ]);

  useEffect(() => {
    if (
      nearByClickedLocationData?.latitude &&
      nearByClickedLocationData?.longitude
    ) {
      const map = mapRef?.current;
      dispatch(setUCodeMarker(latNdLng));
      map?.flyTo({
        center: [
          nearByClickedLocationData?.longitude,
          nearByClickedLocationData?.latitude,
        ],
        zoom: 16,
        speed: 1.2,
        curve: 1.42,
        easing: (t) => t,
      });
    }
  }, [
    uCodeOnlyLng,
    uCodeOnlyLat,
    toggleDistanceButton,
    nearByClickedLocationData,
  ]);

  // initialize the view state
  const [viewState, setViewState] = useState({
    longitude: 90.378392,
    latitude: 23.766631,
    zoom: 14,
  });

  const handleMapillaryData = () => {
    dispatch(setSingleMapillaryData(null));
  };

  // Offer marker clicked
  const clickedOnOfferMarker = (index) => {
    setShowPopup(true);
    dispatch(setIsOfferModalVisible(true));
    dispatch(setOfferData(offersList?.data[index]));
  };

  return (
    <Row>
      <Col span={24}>
        {/* Map component */}
        <Map
          ref={mapRef}
          mapLib={maplibregl}
          initialViewState={viewState}
          style={{
            width: "100%",
            height: "100vh",
          }}
          mapStyle={mapStyle || selectedMapLayer}
          onClick={handleClick}
          onDblClick={handleDoubleClick}
          // pitch={60}
          antialias={true}
          hash={true}
          cursor="all-scroll"
          onZoom={_debounce((e) => {
            if (offerButtonClick) {
              dispatch(
                handleNearByOffers([
                  e.viewState.latitude,
                  e.viewState.longitude,
                ])
              );
            }
          }, 500)}
          onDrag={_debounce((e) => {
            if (offerButtonClick) {
              dispatch(
                handleNearByOffers([
                  e.viewState.latitude,
                  e.viewState.longitude,
                ])
              );
            }
          }, 500)}
          onDragStart={() => {
            mapRef.current.getCanvas().style.cursor = "all-scroll";
          }}
          onMouseMove={(e) => {
            const features = mapRef?.current?.queryRenderedFeatures(e.point);

            if (features?.length > 0) {
              const properties = features[0]?.properties;
              if (features[0]?.layer?.source === "admin") {
                mapRef.current.getCanvas().style.cursor = "pointer";
              } else if (properties?.place_code) {
                mapRef.current.getCanvas().style.cursor = "pointer";
              } else {
                mapRef.current.getCanvas().style.cursor = "default";
              }
            }
            if (
              features?.length > 0 &&
              features[0]?.layer.id === "mapillary-images"
            ) {
              mapRef.current.getCanvas().style.cursor = "pointer";
            }
          }}
        >
          <NavigationControl position="top-right" />
          <GeolocateControl></GeolocateControl>

          {uCodeData && !nearByClickedLocationData && (
            <Marker
              longitude={uCodeData?.longitude || 90.378392}
              latitude={uCodeData?.latitude || 23.766631}
              style={{ zIndex: 99 }}
            >
              <Image
                src="/images/icon.png"
                alt=""
                width={50}
                height={50}
                preview={false}
                style={{ marginBottom: "80px" }}
                // className="marker-animation"
              />
            </Marker>
          )}

          {reverseGeoLngLat &&
            !uCodeData &&
            revGeoData &&
            selectLocationTo === null && (
              <div>
                <Marker
                  longitude={reverseGeoLngLat?.lng || 90.378392}
                  latitude={reverseGeoLngLat?.lat || 23.766631}
                  anchor="bottom"
                  style={{ zIndex: 99 }}
                >
                  {selectLocationTo === null && (
                    <Image
                      src="/images/icon.png"
                      alt=""
                      width={50}
                      height={50}
                      preview={false}
                      className="marker-animation"
                      key={reverseGeoLngLat?.lat}
                    />
                  )}
                </Marker>
              </div>
            )}

          {nearBySearchedData &&
            nearBySearchedData?.places?.map((data, index) => {
              const isClickedLocation =
                nearByClickedLocationData &&
                data.latitude === nearByClickedLocationData.latitude &&
                data.longitude === nearByClickedLocationData.longitude;

              return (
                <Marker
                  key={index}
                  longitude={data.longitude || 90.378392}
                  latitude={data.latitude || 23.766631}
                  style={{ zIndex: 99 }}
                >
                  {!isClickedLocation && (
                    <Image
                      src="/images/icon.png"
                      alt=""
                      width={50}
                      height={50}
                      preview={false}
                      className="marker-animation"
                    />
                  )}
                </Marker>
              );
            })}

          {offerButtonClick &&
            offersList &&
            offersList.data?.map((data, index) => {
              return (
                <div key={index}>
                  <Marker
                    longitude={data.longitude || 90.378392}
                    latitude={data.latitude || 23.766631}
                    style={{ zIndex: 99 }}
                    color="red"
                    onClick={() => clickedOnOfferMarker(index)}
                  ></Marker>
                  <Popup
                    longitude={data.longitude || 90.378392}
                    latitude={data.latitude || 23.766631}
                    style={{ top: "-33px" }}
                    onClick={() => clickedOnOfferMarker(index)}
                    // color="red"
                    anchor="bottom"
                    closeButton={false}
                    closeOnClick={false}
                  >
                    {data.business_name}
                  </Popup>
                </div>
              );
            })}
          {nearByClickedLocationData && (
            <Marker
              longitude={nearByClickedLocationData?.longitude}
              latitude={nearByClickedLocationData?.latitude}
            >
              {selectLocationTo === null && (
                <Image
                  src="/images/red_Icon.png"
                  alt=""
                  width={40}
                  height={60}
                  preview={false}
                  className="wobble-hor-bottom"
                />
              )}
            </Marker>
          )}

          {onHoverMarkerData?.longitude && (
            <Marker
              longitude={onHoverMarkerData?.longitude}
              latitude={onHoverMarkerData?.latitude}
            >
              {selectLocationTo === null && (
                <Image
                  src="/images/red_Icon.png"
                  alt=""
                  width={40}
                  height={60}
                  preview={false}
                />
              )}
            </Marker>
          )}
          <SwitchButton id={setSingleMapillaryData}></SwitchButton>
          {/* <GeolocationComponent></GeolocationComponent> */}
          <OfferFromViewport></OfferFromViewport>
          <MapLayer></MapLayer>

          {!mapillaryData && (
            <Row
              justify="start"
              style={{ padding: "10px" }}
              className="searchBars"
            >
              {/* passing search functionality */}
              <Col>
                {mapVisibility ? (
                  <SearchComponent onLocationSelect={handleLocationSelect} />
                ) : (
                  <DistanceSearch />
                )}
              </Col>
            </Row>
          )}

          {/* layers on map */}
          <DeckGLOverlay layers={[...layers]} />

          {mapillaryData && (
            <Source
              type="vector"
              tiles={[
                "https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=MLY|9965372463534997|6cee240fad8e5571016e52cd3f24d7f8",
              ]}
              minzoom={6}
              maxzoom={14}
            >
              <Layer
                id="mapillary-sequences"
                type="line"
                source="mapillary"
                source-layer="sequence"
                paint={{
                  "line-color": "#05CB63",
                  "line-width": 1,
                }}
                layout={{
                  "line-join": "round",
                  "line-cap": "round",
                }}
              />
              <Layer
                id="mapillary-images"
                type="circle"
                source="mapillary"
                source-layer="image"
                paint={{
                  // 'circle-color': '#05CB63',
                  "circle-color": "#05CB63",
                  "circle-radius": 5,
                }}
              />
            </Source>
          )}
          {singleMapillaryData && (
            <MapillaryViewer
              onMapillaryData={handleMapillaryData}
              id={singleMapillaryData}
            />
          )}
        </Map>
      </Col>
    </Row>
  );
};

export default MainMap;
