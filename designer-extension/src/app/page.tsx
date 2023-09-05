"use client";
import { motion } from "framer-motion"; // For animations
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Site {
  createdOn: string;
  customDomains: string[];
  displayName: string;
  id: string;
  lastPublished: string;
  lastUpdated: string;
  previewUrl: string;
  shortName: string;
  timeZone: string;
  workspaceId: string;
}

interface Image {
  url: string;
}

interface UserInputProps {
  setImages: any;
  setPage: any;
  token: string;
}

interface SelectedImage {
  index: number;
  url: string;
}

interface ImageOptionsProps {
  images: Image[];
  resetUserInput: () => void;
  selectedSite: Site | null;
  token: string;
}

interface SiteSelectionProps {
  token: string;
  setSelectedSite: any;
  setPage: any;
}

interface LoginProps {
  setPage: any;
  token: any;
  setToken: any;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const MainPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [token, setToken] = useState<string>("");
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("devflow_token");
      setPage(auth ? 1 : 0);
      setToken(auth || "");
    }
  }, []);

  if (!token) {
    return <Login setPage={setPage} token={token} setToken={setToken} />;
  }

  switch (page) {
    case 0:
      return <Login setPage={setPage} token={token} setToken={setToken} />;
    case 1:
      return (
        <SiteSelection
          token={token}
          setSelectedSite={setSelectedSite}
          setPage={setPage}
        />
      );
    case 2:
      return (
        <UserInput setImages={setImages} setPage={setPage} token={token} />
      );
    case 3:
      return (
        <ImageOptions
          images={images}
          resetUserInput={() => {
            setImages([]);
            setPage(2);
          }}
          selectedSite={selectedSite}
          token={token}
        />
      );
  }
};

const Login: React.FC<LoginProps> = ({
  setPage,
  token,
  setToken,
}: {
  setPage: any;
  token: any;
  setToken: any;
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen py-2 bg-wf-gray text-wf-lightgray"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-8">
        <div>
          <h1 className="mt-3 text-4xl font-bold text-gray-200 mb-2">
            Image Generator
          </h1>
          <h2 className="mt-3 text-lg text-gray-400 mb-2">by Devflow.party</h2>
          <div className="mt-8 space-y-6">
            <input
              type="text"
              onBlur={(e) => {
                setToken(e.target.value);
              }}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Enter your auth token"
            />
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer border-gray-700"
              onClick={() => {
                localStorage.setItem("devflow_token", token);
                setPage(1);
              }}
            >
              Authenticate
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SiteSelection: React.FC<SiteSelectionProps> = ({
  token,
  setSelectedSite,
  setPage,
}: {
  token: string;
  setSelectedSite: any;
  setPage: any;
}) => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      console.log(`HELLO: ${BACKEND_URL}/api/sites?auth=${token}`)
      const response = await fetch(`${BACKEND_URL}/api/sites?auth=${token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSites(data.sites);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-2 px-2 bg-wf-gray text-wf-lightgray">
      <div className="text-center space-y-4 flex flex-col h-full justify-between pb-2">
        <div>
          <h1 className="text-lg font-bold text-gray-200 mb-2 mt-2">
            Select a Site
          </h1>
          {loading && <p>Loading sites...</p>}
          {!loading && sites.length === 0 && <p>No sites available</p>}
          {!loading &&
            sites.map((site, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedSite(site);
                  setPage(2);
                }}
                className="mb-2 rounded-md py-2 px-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer border-gray-700 w-full"
              >
                {site.displayName}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

const UserInput: React.FC<UserInputProps> = ({ setImages, token, setPage }) => {
  const [prompt, setPrompt] = useState<string>("");
  const [size, setSize] = useState<number>(256);
  const [n, setN] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const generateImages = async () => {
    setIsLoading(true);
    const params = new URLSearchParams({
      auth: token,
      prompt: prompt,
      n: n.toString(),
      size: size.toString(),
    });

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/images?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.images) {
        setImages(data.images);
        setPage(3);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-2 px-2 bg-wf-gray text-wf-lightgray h-screen overflow-auto">
      <div className="text-center space-y-4 flex flex-col h-full justify-between pb-2">
        <div>
          <h1 className="text-lg font-bold text-gray-200 mb-2 mt-2">
            Describe your desired image
          </h1>
          <textarea
            className="bg-gray-700 rounded-md p-2 w-full h-32 -mb-2 resize-none"
            placeholder="A busy coffee shop with people working on their laptops."
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
                onClick={() => setSize(btnSize)}
                className={`mb-2 rounded-md py-2 px-2 text-xs font-medium text-white ${
                  size === btnSize ? "bg-blue-600" : "bg-gray-700"
                } hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer border-gray-700 w-full`}
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
        <div>
          <button
            onClick={generateImages}
            className="rounded-md border border-transparent py-2 px-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer border-gray-700 w-full"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ImageOptions: React.FC<ImageOptionsProps> = ({
  images,
  resetUserInput,
  selectedSite,
  token,
}) => {
  const [page, setPage] = useState<number>(1);
  const [addedImages, setAddedImages] = useState<number[]>([]);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null
  );
  const imagesPerPage = 4;
  const pageLength = Math.ceil(images.length / 4);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const resetImageOptions = () => {
    setPage(1);
    setAddedImages([]);
    setSelectedImage(null);
    setUploading(false);
    setError(null);
  };

  const navigateToImagePreview = (imgIndex: number, url: string) => {
    setSelectedImage({ index: imgIndex, url: url });
  };

  const handleAddImage = async () => {
    if (selectedImage && !addedImages.includes(selectedImage.index)) {
      setUploading(true);
      try {
        if (!selectedSite) {
          throw new Error("No site selected");
        }
        const response = await postImage(selectedImage.url, selectedSite.id);
        if (response.error) {
          throw new Error(response.error);
        }
        setAddedImages([...addedImages, selectedImage.index]);
        setSelectedImage(null);
        setError(null);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setUploading(false);
      }
    }
  };

  async function postImage(imageURL: string, siteId: string) {
    const response = await fetch(`${BACKEND_URL}/api/images`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageURL, siteId, auth: token }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }

  const currentPageImages = images.slice(
    (page - 1) * imagesPerPage,
    page * imagesPerPage
  );

  return (
    <div className="flex flex-col items-center justify-center py-2 px-2 bg-wf-gray text-wf-lightgray h-screen overflow-auto space-y-4">
      {!selectedImage ? (
        <div className="text-center space-y-4 flex flex-col h-full pb-2">
          <div>
            <h1 className="text-lg font-bold text-gray-200 mb-2 mt-2">
              Select Your Custom Images
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-2 justify-center mb-2">
            {currentPageImages.map((img, i) => (
              <div key={i} className="relative">
                <Image
                  src={img.url}
                  alt=""
                  width={128}
                  height={128}
                  className="object-cover rounded-md cursor-pointer"
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
          {pageLength > 1 && (
            <div className="flex justify-between items-center w-full">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                Prev
              </button>
              <span>
                Page {page} of {pageLength}
              </span>
              <button
                disabled={page === pageLength}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full overflow-auto space-y-4">
          <Image
            src={selectedImage.url}
            alt=""
            width={256}
            height={256}
            className="object-cover rounded-md cursor-pointer"
          />
          <div className="flex justify-between items-center w-full">
            <button onClick={() => setSelectedImage(null)}>Go Back</button>
            <button onClick={handleAddImage} disabled={uploading}>
              {uploading ? "Uploading..." : "Add"}
            </button>
          </div>
          {error && <div>Error: {error}</div>}
        </div>
      )}
      <div className="mt-4">
        <button
          className="group relative justify-center rounded-md border border-transparent bg-blue-600 py-2 px-2 text-xs font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer border-gray-700 w-full"
          onClick={() => {
            resetImageOptions();
            resetUserInput();
          }}
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default MainPage;
