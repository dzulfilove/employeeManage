import React, { useEffect, useState } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

const DocumentViewer = () => {
  const docs = [
    { uri: "" }, // Remote file
    //   { uri: require("./example-files/pdf.pdf") }, // Local File
  ];
  const fileUrl =
    "https://firebasestorage.googleapis.com/v0/b/scrum-management-6pk6ht.appspot.com/o/cvPegawai%2FDzulfi%20Allaudin%20Hafidz%20-%20Full%20Stack%20Developer%20-%20CV%20(1).docx?alt=media&token=d2570c74-5d91-4d97-8d30-de827979afc7";
  const [activeDocument, setActiveDocument] = useState(docs[0]);

  const handleDocumentChange = (document) => {
    setActiveDocument(document);
  };

  return (
    <>
      <DocViewer
        documents={docs}
        activeDocument={activeDocument}
        onDocumentChange={handleDocumentChange}
      />
      <iframe
        src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
        style={{ width: "100%", height: "600px" }}
        frameBorder="0"
      />
    </>
  );
};

export default DocumentViewer;
