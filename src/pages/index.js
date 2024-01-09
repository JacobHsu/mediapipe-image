import React, { useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import { ImageEmbedder, FilesetResolver } from "@mediapipe/tasks-vision";
import dogEmbedding from "../embedding/dog.json";

export default function Home() {
  const [imageEmbedder, setImageEmbedder] = React.useState(null);
  // const [runningMode, setRunningMode] = React.useState("IMAGE");
  const [dogValue, setDogValue] = React.useState(null);
  const [catValue, setCatValue] = React.useState(null);

  useEffect(() => {
    FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    ).then((vision) => {
      ImageEmbedder.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/image_embedder/mobilenet_v3_small/float32/1/mobilenet_v3_small.tflite`,
        },
        runningMode: "IMAGE",
      }).then((result) => {
        setImageEmbedder(result);
      });
    });
  }, []);

  useEffect(() => {

    const imageContainer1 = document.getElementById("embedOnClick1");
    const imageContainer2 = document.getElementById("embedOnClick2");
    const imageResult = document.getElementById("im_result");

    const handleClick = async (event) => {
      if (!imageEmbedder) {
        console.log("Wait for objectDetector to load before clicking");
        return;
      }

      const imageEmbedderResult0 = imageEmbedder.embed(
        imageContainer1.children[0]
      );
      
      const imageEmbedderResult1 = imageEmbedder.embed(
        imageContainer2.children[0]
      );

      const truncatedEmbedding0 =
        imageEmbedderResult0.embeddings[0].floatEmbedding;
      truncatedEmbedding0.length = 4;
      const truncatedEmbedding1 =
        imageEmbedderResult1.embeddings[0].floatEmbedding;
      truncatedEmbedding1.length = 4;

      setDogValue(truncatedEmbedding0);
      setCatValue(truncatedEmbedding1);

      // Compute cosine similarity.
      const similarity = ImageEmbedder.cosineSimilarity(
        imageEmbedderResult0.embeddings[0],
        imageEmbedderResult1.embeddings[0]
      );
      console.log(similarity);
      imageResult.className = "";
      imageResult.innerText = "Image similarity: " + similarity.toFixed(2);
    };

    // Now let's go through all of these and add a click event listener.
    imageContainer1.children[0].addEventListener("click", handleClick);
    imageContainer2.children[0].addEventListener("click", handleClick);
  }, [imageEmbedder]);

  useEffect(() => {
    if (!imageEmbedder) {
      return;
    }

    const imageContainer1 = document.getElementById("embedOnClick1");
    // const imageContainer2 = document.getElementById("embedOnClick2");
    const imageJsonResult = document.getElementById("json_result");

    const handleClick = async (event) => {
      const imageEmbedderResult0 = imageEmbedder.embed(
        imageContainer1.children[0]
      );

      // Compute cosine similarity.
      const similarity = ImageEmbedder.cosineSimilarity(
        dogEmbedding,
        imageEmbedderResult0.embeddings[0]
      );
      // console.log(similarity);
      
      imageJsonResult.className = "";
      imageJsonResult.innerText = "Image & Json similarity: " + similarity.toFixed(2);

      // 創建一個 Blob 實例
      // const imageEmbedderResult0 = imageEmbedder.embed(
      //   imageContainer1.children[0]
      // );
      // let jsonContent = JSON.stringify(imageEmbedderResult0);
      // let blob = new Blob([jsonContent], {type: "application/json"});
      // let url = URL.createObjectURL(blob);
      // let a = document.createElement('a');
      // a.href = url;
      // a.download = 'dog.json';
      // a.click(); // 觸發下載
    };
  
    imageContainer1.children[0].addEventListener("click", handleClick);
 
  }, [imageEmbedder]);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <p>
        <b>Click on an image below</b> to calculate the similarity between the
        two images.
      </p>

      <div className="mb-32 grid text-center lg:grid-cols-2">
        <div class="embedOnClick cursor-pointer" id="embedOnClick1">
          <Image
            src="/dog.jpeg"
            width={400}
            height={265}
            alt="dog"
            crossorigin="anonymous"
            title="Click to get embeddings and cosine similarity"
          />
          {dogValue}
        </div>

        <div class="embedOnClick" id="embedOnClick2">
          <img
            src="https://assets.codepen.io/9177687/cat_flickr_publicdomain.jpeg"
            width={400}
            height={265}
            alt="cat"
            crossorigin="anonymous"
            title="Click to get embeddings and cosine similarity"
          />
          {catValue}
        </div>
      </div>

      <p id="im_result" class="removed"></p>
      <p id="json_result" class="removed"></p>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Docs{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Learn{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>
      </div>
    </main>
  );
}
