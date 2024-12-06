import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const PDFViewer = () => {
  const { url } = useParams(); // M
  useEffect(() => {
    // Define a function to resize the embedded PDF
    const resizeEmbed = () => {
      // Retrieve the embedded PDF element by its ID
      const embed = document.getElementById("pdfEmbed");
      if (embed) {
        // Get the height of the window
        const windowHeight = window.innerHeight;
        // Set the height of the embedded PDF to match the window height
        embed.style.height = `${windowHeight}px`;
      }
    };

    resizeEmbed();
    window.addEventListener("resize", resizeEmbed);
    return () => window.removeEventListener("resize", resizeEmbed);
  }, []);

  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <embed
        id="pdfEmbed"
        src={url}
        type="application/pdf"
        width="100%"
        height="100%"
        style={{ border: "none" }}
      />
    </div>
  );
};

export default PDFViewer;
