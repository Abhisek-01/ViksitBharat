import React, { useState, useCallback, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { auth } from '../firebase';
import { sendComplaintSubmissionEmail } from '../components/emailService';
import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";
import AuthModal from "./AuthModal";

const mapContainerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

const ComplaintForm = ({ onSubmit }) => {
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [showMap, setShowMap] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedLocation({
      lat,
      lng,
      name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    });
  }, []);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("❌ Geolocation is not supported by your browser. Please select location manually on the map.");
      setShowMap(true);
      return;
    }
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = {
          lat: latitude,
          lng: longitude,
          name: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        };
        setSelectedLocation(location);
        setMapCenter({ lat: latitude, lng: longitude });
        setShowMap(true);
        setIsGettingLocation(false);
        setTimeout(() => {
          alert("✅ Location detected successfully!");
        }, 100);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsGettingLocation(false);
        let errorMessage = "Unable to get your location. ";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "You denied location permission. Please enable it in your browser settings or select manually on the map.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable. Please select manually on the map.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out. Please try again or select manually on the map.";
            break;
          default:
            errorMessage += "An unknown error occurred. Please select manually on the map.";
        }
        alert(errorMessage);
        setShowMap(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const checkRateLimit = () => {
    if (!lastSubmitTime) return true;
    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTime;
    const cooldownPeriod = 5 * 60 * 1000;
    if (timeSinceLastSubmit < cooldownPeriod) {
      const remainingTime = Math.ceil((cooldownPeriod - timeSinceLastSubmit) / 60000);
      alert(`Please wait ${remainingTime} more minute(s) before submitting another complaint.`);
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (submitDisabled) {
      let secondsLeft = 5 * 60;
      setCooldownSeconds(secondsLeft);
      const interval = setInterval(() => {
        secondsLeft -= 1;
        setCooldownSeconds(secondsLeft);
        if (secondsLeft <= 0) {
          setSubmitDisabled(false);
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [submitDisabled]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setShowAuthModal(true);
      return;
    }
    if (!checkRateLimit()) {
      return;
    }
    if (!description || !photo || !selectedLocation) {
      alert("Please fill all fields and select a location on the map");
      return;
    }
    const complaintData = {
      description,
      location: selectedLocation.name,
      photoUrl: photoPreview,
      coordinates: { lat: selectedLocation.lat, lng: selectedLocation.lng },
      userId: auth.currentUser.uid,
      userEmail: auth.currentUser.email,
    };
    await onSubmit(complaintData);
    if (auth.currentUser?.email) {
      await sendComplaintSubmissionEmail(auth.currentUser.email, complaintData);
      alert('✅ Complaint submitted successfully! Check your email for confirmation.');
    } else {
      alert('✅ Complaint submitted successfully!');
    }
    setLastSubmitTime(Date.now());
    setSubmitDisabled(true);

    // Instant logout after complaint submission
    await auth.signOut();

    setDescription("");
    setPhoto(null);
    setPhotoPreview(null);
    setSelectedLocation(null);
    setShowMap(false);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  return (
    <>
      <div id="report" className="my-20 min-h-96 w-screen px-10">
        <div className="relative rounded-lg bg-[#663399] py-24 text-blue-50 sm:overflow-hidden">
          <div className="absolute -left-20 top-0 hidden h-full w-72 overflow-hidden sm:block lg:left-20 lg:w-96"></div>
          <div className="absolute -top-40 left-20 w-60 sm:top-1/2 md:left-auto md:right-10 lg:top-20 lg:w-80"></div>
          <div className="flex flex-col items-center text-center relative z-10">
            <AnimatedTitle
              title="Report your civic issue below."
              className="special-font !md:text-[6.2rem] w-full font-zentry !text-5xl !font-black !leading-[.9]"
            />
            {!auth.currentUser && (
              <div className="">
                <div className="mt-6 p-4 bg-blue-600/20 border rounded-lg max-w-2xl">
                  <p className="text-sm text-blue-200">
                    🔐 Please{' '}
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="underline font-semibold hover:text-blue-100 transition"
                    >
                      sign in
                    </button>{' '}
                    to submit a complaint
                  </p>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="mt-10 w-full max-w-2xl space-y-6 border-2 border-blue-500 px-5 py-5 rounded-lg">
              <div>
                <label className="block mb-2 text-left font-medium text-sm">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#5d407b] border-2 border-zinc-500 focus:border-blue-500 focus:outline-none transition-all text-white"
                  rows={4}
                  placeholder="Describe the civic issue in detail..."
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-left font-medium text-sm">Upload Photo *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full p-2 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                  required
                />
                {photoPreview && (
                  <div className="mt-4">
                    <img src={photoPreview} alt="Preview" className="max-h-48 rounded-lg mx-auto border-4 border-blue-500/50 shadow-lg" />
                  </div>
                )}
              </div>
              <div>
                <label className="block mb-2 text-left font-medium text-sm">Select Location *</label>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleGetCurrentLocation}
                      disabled={isGettingLocation}
                      className="flex-1 bg-[#4A8BDF] hover:bg-[#111990a3] disabled:bg-green-800 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
                    >
                      {isGettingLocation ? (
                        <>
                          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Getting Location...
                        </>
                      ) : (
                        <>📍 Use Current Location</>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMap(!showMap)}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-semibold transition-all duration-300"
                    >
                      🗺️ {showMap ? "Hide Map" : "Select on Map"}
                    </button>
                  </div>
                  {showMap && (
                    <div className="border-4 border-blue-500/50 rounded-lg overflow-hidden">
                      <LoadScript
                        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                        onLoad={() => console.log("Google Maps script loaded")}
                        onError={(error) => console.error("Google Maps script error:", error)}
                      >
                        <GoogleMap
                          mapContainerStyle={mapContainerStyle}
                          center={mapCenter}
                          zoom={12}
                          onClick={handleMapClick}
                          options={{
                            streetViewControl: false,
                            mapTypeControl: false,
                          }}
                        >
                          {selectedLocation && isMapLoaded && (
                            <Marker
                              position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                            />
                          )}
                        </GoogleMap>
                      </LoadScript>
                      <p className="text-xs text-center mt-2 p-2 text-gray-400 bg-black/30">
                        💡 Click anywhere on the map to mark the issue location
                      </p>
                    </div>
                  )}
                  {selectedLocation && (
                    <div className="p-4 bg-green-600/20 border-2 border-green-500/50 rounded-lg">
                      <p className="text-sm font-bold text-green-300">✓ Location Selected</p>
                      <p className="text-xs text-gray-300 mt-1">
                        Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <Button
                title={submitDisabled ? `Please wait (${cooldownSeconds}s)` : (auth.currentUser ? "Submit Complaint" : "Sign In to Submit")}
                containerClass={`mt-6 cursor-pointer w-full ${submitDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={submitDisabled}
              />
            </form>
            <p className="mt-6 text-xs text-black">* All fields are required</p>
            <p className="mt-2 text-xs text-black">Rate limit: 1 complaint per 5 minutes • Email confirmation sent</p>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => alert('Successfully logged in! You can now submit complaints.')}
      />
    </>
  );
};

export default ComplaintForm;
