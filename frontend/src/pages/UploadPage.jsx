import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const UploadPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creator, setCreator] = useState("");
  const [filePath, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", filePath);
    // formData.append("creator", creator);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/videos/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res.data);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  // sm:w-4/5 md:w-1/2 border border-gray-500 rounded-2xl shadow-xl p-8 flex flex-col justify-between bg-white/10 backdrop-blur-3xl"
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <div className="max-w-2xl mx-auto mt-10  bg-white/10 backdrop-blur-3xl  border-gray-500 border rounded-2xl shadow-xl p-8 ">
        <h2 className="text-2xl font-bold mb-6 text-center ">Upload Video</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Video Title"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Description"
            className="w-full p-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          {/* <input
          type="text"
          placeholder="Uploaded By"
          className="w-full p-2 border rounded"
          value={creator}
          onChange={(e) => setTitle(e.target.value)}
          required
        /> */}
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
          <button
            // onClick={() => console.log("Mahi")}
            type="submit"
            className="w-2/5 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
