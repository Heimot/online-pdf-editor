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
  const [chosenPDF, setChosenPDF] = useState<string>("")

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
      })
  }, [])

  useEffect(() => {
    try {
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
        if (image.imageURL === "") return;
        let img = new Image();
        img.crossOrigin = "";
        img.src = image.imageURL;

        doc.addImage(img, "", Number(image.xPosition), Number(image.yPosition), Number(image.width), Number(image.height));
      })
      let url = doc.output('bloburl') + "#toolbar=0&navpanes=0";
      pdfRef.current?.setAttribute('src', url.toString());
    } catch (err) {
      console.log(err)
    }
  }, [pdfData])

  const getPDF = (id: string) => {
    if (id === undefined) return;
    setChosenPDF(id);
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

  const createNewPDF = () => {
    let date = Date.now();
    fetch('http://localhost:5000/pdf/create_pdf', {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYmJiMjdkMDFlOGQxZjZlMzVmNTFjYSIsImlhdCI6MTY3MzMzMDg3OSwiZXhwIjoxNjc5MzMwODc5fQ.MfhU7s4GCTnV3c6PRd6pSlOcdIBZtmBD_SzrEaFXbkc'
      },
      body: JSON.stringify({
        currentUserId: "63bbb27d01e8d1f6e35f51ca",
        PDFName: "pdf" + date
      })
    })
    .then((response) => response.json())
    .then((res) => {
      setPdfs((prevState: pdfs[] | any) => [...prevState, { _id: res.result._id, PDFName: res.result.PDFName }])
    })
  }

  const deletePDF = () => {
    fetch('http://localhost:5000/pdf/delete_pdf', {
      method: "DELETE",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYmJiMjdkMDFlOGQxZjZlMzVmNTFjYSIsImlhdCI6MTY3MzMzMDg3OSwiZXhwIjoxNjc5MzMwODc5fQ.MfhU7s4GCTnV3c6PRd6pSlOcdIBZtmBD_SzrEaFXbkc'
      },
      body: JSON.stringify({
        currentUserId: "63bbb27d01e8d1f6e35f51ca",
        _id: chosenPDF
      })
    })
    .then((response) => response.json())
    .then((res) => {
      let data = pdfs?.filter((pdf) => {
        return pdf._id !== chosenPDF
      })
      setPdfs(data);
      setPdfData(null);
      console.log(res);
    })
  }

  return (
    <div className="App">
      <span>PDF select</span>
      <select onChange={((e) => getPDF(e.target.value))}>
        <option value={undefined}></option>
        {pdfs?.map((pdfName) => {
          return <option key={pdfName._id} value={pdfName._id}>{pdfName.PDFName}</option>
        })}
      </select>
      <button onClick={() => createNewPDF()}>Create new pdf</button>
      <button onClick={() => deletePDF()}>Delete pdf</button>
      <div>
        <iframe style={{ "width": (pdfData !== null ? pdfData?.width * 3.7795275591 : 0), "height": (pdfData !== null ? pdfData?.height * 3.7795275591 : 0), "backgroundColor": 'white', border: "black 5px solid", transform: "scale(1)" }} ref={pdfRef} />
      </div>
      <div>
        <PDFEditor pdfData={pdfData} setPdfData={(value: PDFData) => setPdfData(value)} getFonts={doc.getFontList()} />
        <button onClick={printPDF}>Print</button>
      </div>
    </div>
  );
}

export default App;
