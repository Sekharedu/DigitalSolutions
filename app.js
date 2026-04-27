import React, { useEffect, useState } from "react";
import Globe from "react-globe.gl";

const PopulationGlobe = () => {
  const [cities, setCities] = useState([]);

  // বিশ্বের বড় শহরগুলোর ডেটা লোড করা (Sample Data)
  useEffect(() => {
    const majorCities = [
      { name: "ঢাকা", lat: 23.8103, lng: 90.4125, pop: "22.4 Million", color: "yellow" },
      { name: "Tokyo", lat: 35.6762, lng: 139.6503, pop: "37.4 Million", color: "red" },
      { name: "New York", lat: 40.7128, lng: -74.006, pop: "8.8 Million", color: "cyan" },
      { name: "London", lat: 51.5074, lng: -0.1278, pop: "9.0 Million", color: "lime" },
      { name: "Mumbai", lat: 19.076, lng: 72.8777, pop: "20.9 Million", color: "orange" }
      // এখানে আরও শহর যোগ করা যাবে
    ];
    setCities(majorCities);
  }, []);

  return (
    <div style={{ backgroundColor: "#000", height: "100vh" }}>
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        
        // শহরগুলোকে উজ্জ্বল বিন্দুর মতো দেখানো
        htmlElementsData={cities}
        htmlElement={(d) => {
          const el = document.createElement('div');
          el.innerHTML = `<div style="width: 12px; height: 12px; background: ${d.color}; border-radius: 50%; cursor: pointer; box-shadow: 0 0 10px ${d.color};"></div>`;
          
          // টাচ বা ক্লিক করলে পপ-আপ দেখানো
          el.onclick = () => alert(`🏙️ শহর: ${d.name}\n👨‍👩‍👧‍👦 জনসংখ্যা: ${d.pop}`);
          return el;
        }}
      />
      
      {/* ইনস্ট্রাকশন লেবেল */}
      <div style={{
        position: 'absolute', top: '20px', width: '100%', textAlign: 'center', 
        color: 'white', fontFamily: 'Arial', pointerEvents: 'none'
      }}>
        <h1>🌍 গ্লোব এক্সপ্লোরার</h1>
        <p>শহরগুলো টাচ করো এবং ম্যাজিক দেখো!</p>
      </div>
    </div>
  );
};

export default PopulationGlobe;
