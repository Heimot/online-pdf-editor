import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import './App.css';
import { PDFData } from './model';
import PDFEditor from './Components/PDFEditor';

interface pdfs {
  _id: string;
  PDFName: string;
}

let doc = new jsPDF();

const App: React.FC = () => {
  const [pdfData, setPdfData] = useState<PDFData | null>(null);
  const [pdfs, setPdfs] = useState<pdfs[]>();

  const pdfRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetch("http://localhost:5000/pdf/get_pdf_names?currentUserId=63bbb27d01e8d1f6e35f51ca", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYmJiMjdkMDFlOGQxZjZlMzVmNTFjYSIsImlhdCI6MTY3MzMzMDg3OSwiZXhwIjoxNjc5MzMwODc5fQ.MfhU7s4GCTnV3c6PRd6pSlOcdIBZtmBD_SzrEaFXbkc'
      }
    })
      .then((response) => response.json())
      .then((responseData) => {
        setPdfs(responseData.result);
        console.log(responseData.result)
      })
  }, [])

  useEffect(() => {
    if (pdfData === null) return;
    doc = new jsPDF(pdfData?.pageLayout, 'mm', [pdfData?.height, pdfData?.width]);
    if (pdfData === null) return;
    pdfData?.PDFText.map((text) => {
      doc.setFont(text.font, text.fontType);
      doc.setFontSize(text.fontSize);
      doc.text(text.text, text.xPosition, text.yPosition);
    })

    if (pdfData === null) return;
    pdfData?.PDFImage.map((image) => {
      let img = new Image();
      img.crossOrigin = "";
      img.src = image.imageURL;
      doc.addImage(img, image.xPosition, image.yPosition, image.width, image.height);
    })
    let url = doc.output('bloburl') + "#toolbar=0&navpanes=0";
    pdfRef.current?.setAttribute('src', url.toString());
  }, [pdfData])



  const getPDF = (id: string) => {
    if (id === undefined) return;
    fetch("http://localhost:5000/pdf/get_pdf_by_id?currentUserId=63bbb27d01e8d1f6e35f51ca&currentPDFId=" + id, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYmJiMjdkMDFlOGQxZjZlMzVmNTFjYSIsImlhdCI6MTY3MzMzMDg3OSwiZXhwIjoxNjc5MzMwODc5fQ.MfhU7s4GCTnV3c6PRd6pSlOcdIBZtmBD_SzrEaFXbkc'
      }
    })
      .then((response) => response.json())
      .then((responseData) => {
        setPdfData(responseData.result[0]);
      })
  }


  const printPDF = () => {
    doc.save();
  }

  return (
    <div className="App">
      <select onChange={((e) => getPDF(e.target.value))}>
        <option value={undefined}></option>
        {pdfs?.map((pdfName) => {
          return <option key={pdfName._id} value={pdfName._id}>{pdfName.PDFName}</option>
        })}
      </select>
      <div>
        <iframe style={{ "width": (pdfData !== null ? pdfData?.width * 3.7795275591 : 0), "height": (pdfData !== null ? pdfData?.height * 3.7795275591 : 0), "backgroundColor": 'white', border: "black 5px solid", transform: "scale(1)" }} ref={pdfRef} />
      </div>
      <div>
        <PDFEditor pdfData={pdfData} setPdfData={(value: PDFData) => setPdfData(value)} />
        <button onClick={printPDF}>Print</button>
      </div>
    </div>
  );
}

export default App;
