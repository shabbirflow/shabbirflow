import React, { useState, useEffect } from "react";
import axios from "axios";
// import app from "./base";
import "./table.css";
//import Navbar from "./navbar";
// import Map from "./components/Map/Map";
import NavBar from "./components/NavBar/NavBar";

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_ENDPOINT_VID = "https://2860-2401-4900-8fc9-20e8-f160-3374-efad-4faa.ngrok-free.app";
  const [videoId, setVideoId] = useState();
  function convertToIST(utcTime) {
    const date = new Date(utcTime);
    const istTime = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
    return istTime.toUTCString();
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await axios.get(
        "https://api.thingspeak.com/channels/2506011/feeds.json?results=200"
      );
      setData(response.data.feeds.slice().reverse());
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const fetchData = async () => {
        const response = await axios.get(
          "https://api.thingspeak.com/channels/2506011/feeds.json?results=200"
        );
        setData(response.data.feeds.slice().reverse());
      };
      fetchData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getId = async () => {
      try {
        const res = await axios.get(`${API_ENDPOINT_VID}/getid`, {
          headers: {
            "ngrok-skip-browser-warning": "any-value"
          }
        });
        // Assuming your API returns a list of video IDs
        // setVideoIds(res.data); 
        console.log("Video IDs", res.data);
        setVideoId(res.data.id);
      } catch (error) {
        console.error("Error fetching video IDs", error);
      }
    };
    getId();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const getId = async () => {
    const res = await axios.get(
      API_ENDPOINT_VID + "/getId"
    );
    console.log("RES", res);  
  }

  return (
    <div>
      <NavBar />
      <div className="outer-table">
        <table className="tableSt" style={{ textAlign: "center" }}>
          <thead className="header-row">
            <tr>
              <th style={{ textAlign: "center" }} className="tableTh">
                Location
              </th>
              <th style={{ textAlign: "center" }} className="tableTh">
                Date/Time
              </th>

              <th style={{ textAlign: "center" }} className="tableTh">
                Temperature
              </th>
              <th style={{ textAlign: "center" }} className="tableTh">
                Relative Speed
              </th>
              <th style={{ textAlign: "center" }} className="tableTh">
                Video Feed
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr className="tableTr" key={item.entry_id}>
                <td className="tableTd">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${item.field1},${item.field2}`}
                    target="_blank" rel="noreferrer"
                  >
                    Location
                  </a>
                  <br />({item.field1}, {item.field2})
                </td>

                <td className="tableTd">{convertToIST(item.created_at)}</td>

                <td className="tableTd">{item.field3}</td>
                <td className="tableTd">{item.field4}</td>
                <td className="tableTd">
                  {/* {getId()} */}
                  <a
                    href={`https://pub-99108591c26945f880c380bf32c43a20.r2.dev/videodata/${videoId}/footage.mp4`}
                    target="_blank" rel="noreferrer"
                  >
                    Video
                  </a>
                  <br />
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
