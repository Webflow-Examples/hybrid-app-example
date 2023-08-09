'use client';
import { useState, useEffect } from "react";

export default function SiteSelection() {
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const response = await fetch('/api/sites', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSites(data.sites);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSiteSelection = (site) => {
    debugger
    setSelectedSite(site);
  };

  if (selectedSite) {
    return <UserInput selectedSite={selectedSite} />;
  }

  return (
    <div
      className="flex flex-col items-center justify-center py-2 px-4 bg-gray-400 text-wf-lightgray"
    >
      <div className="text-center space-y-4 flex flex-col h-full justify-between pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-200 mb-2 mt-4">
            Select a Site
          </h1>
          {loading && <p>Loading sites...</p>}
          {!loading && sites.length === 0 && <p>No sites available</p>}
          {!loading && sites.map((site, index) => (
            // This is horrible. Display a dropdown instead.
            <button
              key={index}
              onClick={() => handleSiteSelection(site)}
              className="mb-2 rounded-md py-2 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer border-gray-700 w-1/2"
            >
              {site.displayName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function UserInput({ selectedSite }) {
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState(256);
  const [n, setN] = useState(1);
  const [images, setImages] = useState([]);

  const resetUserInput = () => {
    setPrompt("");
    setSize(256);
    setN(1);
    setImages([]);
  };

  const generateImages = async () => {
    const params = new URLSearchParams({ prompt: prompt, n: n, size: size });

    try {
      const response = await fetch(`/api/images?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.images) {
        setImages(data.images);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  if (images.length > 0) {
    return <ImageOptions images={images} resetUserInput={resetUserInput} site={selectedSite} />;
  }

  return (
    <div
      className="flex flex-col items-center justify-center py-2 px-4 bg-gray-400 text-wf-lightgray"
    >
      <div className="text-center space-y-4 flex flex-col h-full justify-between pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-200 mb-2 mt-4">
            Describe your desired image
          </h1>
          <textarea
            className="bg-gray-700 rounded-md p-2 w-full h-32 -mb-2 resize-none"
            placeholder="Start describing your image here. For instance: 'A busy coffee shop with people working on their laptops.'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <p className="text-white mb-2">Image size: {size}</p>
          <div className="flex justify-center w-full space-x-2">
            {[256, 512, 1024].map((btnSize, i) => (
              <button
                key={i}
                className={`rounded-md py-2 px-4 text-sm font-medium text-white ${
                  size === btnSize ? "bg-blue-600" : "bg-gray-700"
                }`}
                onClick={() => setSize(btnSize)}
              >
                {btnSize}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-2">
          <p className="text-white mb-2">Number of images: {n}</p>
          <input
            className="rounded-md bg-gray-700 w-full"
            type="range"
            min="1"
            max="10"
            value={n}
            onChange={(e) => setN(parseInt(e.target.value))}
          />
        </div>
        <div className="mt-2">
          <button
            className="group relative justify-center rounded-md border border-transparent bg-blue-600 py-2 px-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer border-gray-700 w-1/2"
            onClick={generateImages}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageOptions({ images, resetUserInput, site }) {
  const [page, setPage] = useState(1);
  const [addedImages, setAddedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const imagesPerPage = 4;
  const pageLength = Math.ceil(images.length / 4);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const resetImageOptions = () => {
    setPage(1);
    setAddedImages([]);
    setSelectedImage(null);
    setUploading(false);
    setError(null);
  };

  const navigateToImagePreview = (imgIndex, url) => {
    setSelectedImage({index: imgIndex, url: url});
  };

  const handleAddImage = async () => {
    if (selectedImage && !addedImages.includes(selectedImage.index)) {
      setUploading(true);
      try {
        const response = await postImage(selectedImage.url);
        if (response.error) {
          throw new Error(response.error);
        }
        setAddedImages([...addedImages, selectedImage.index]);
        setSelectedImage(null);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setUploading(false);
      }
    }
  };

  async function postImage(imageURL) {
    const response = await fetch('/api/images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageURL, siteId: site.id }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }

  const currentPageImages = images.slice((page - 1) * imagesPerPage, page * imagesPerPage);

  return (
    <div
      className="flex flex-col items-center justify-center py-1 px-4 bg-wf-gray text-wf-lightgray w-full overflow-hidden"
    >
      {!selectedImage ? (
        <div className="text-center space-y-4 flex flex-col h-auto justify-between overflow-y-auto">
          <div>
            <h1 className="text-xl font-bold text-gray-200 mb-2">
              Select Your Custom Images
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-2 justify-center">
            {currentPageImages.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={img.url}
                  alt=""
                  className="w-32 h-32 object-cover rounded-md cursor-pointer"
                  onClick={() => {
                    const index = i + 1 + (page - 1) * 4;
                    navigateToImagePreview(index, img.url);
                  }}
                />
                {addedImages.includes(i + 1 + (page - 1) * 4) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                    <span className="text-white">Added!</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center w-full mt-4">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Prev
            </button>
            <span>Page {page} of {pageLength}</span>
            <button disabled={page === pageLength} onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full overflow-auto">
          <img
            src={selectedImage.url}
            alt=""
            className="object-cover w-full h-full rounded-md cursor-pointer"
          />
          <div className="flex justify-between items-center w-full mt-4">
            <button onClick={() => setSelectedImage(null)}>Go Back</button>
            <button onClick={handleAddImage}>Add</button>
            {error && <div>Error: {error}</div>}
            {uploading && <div>Uploading to {site.displayName}...</div>}
          </div>
        </div>
      )}
      <div className="flex justify-center w-full my-4">
        <button
          className="group relative justify-center rounded-md border border-transparent bg-blue-600 py-2 px-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer border-gray-700 w-1/2"
          onClick={() => {resetImageOptions(); resetUserInput();}}
        >
          Start Over
        </button>
      </div>
    </div>
  );
}