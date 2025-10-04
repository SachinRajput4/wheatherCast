
import React, { useEffect, useState, useContext } from "react";
import {Route, Routes}from 'react-router-dom'
import { StoreContext } from "../../components/context/StoreContext";
import TakeAttendanceCollectionList from "../../components/CollectionList/TakeAttendanceCollectionList";
// import AttendanceUpload from "../../components/AttendanceUpload/AttendanceUpload";

const TakeAttendance = () => {
  const [collection,setCollection]=useState(null);

  return (
    <div>
      <Routes>
        <Route path="/" element={<TakeAttendanceCollectionList collection={collection} setCollection={setCollection} />} />
        <Route path="/upload" element={<AttendanceUpload collection={collection} />} />
      </Routes>
    </div>
  );
}; 

export default TakeAttendance;
