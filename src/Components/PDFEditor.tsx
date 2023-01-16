import React, { useEffect, useState } from 'react'
import { PDFData, PDFText, PDFImage, Fonts, GetFonts } from '../model'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import './PDFStyles.css';
import PDFTableTextData from './PDFTableTextData';
import PDFTableImageData from './PDFTableImageData';

interface Props {
    pdfData: PDFData | null;
    setPdfData: (value: PDFData | any) => void;
    getFonts: GetFonts;
}

interface Acc {
    propName: string;
    value: any;
}

interface PDFPropData {
    _id: string;
    data: Acc[];
}

const PDFEditor: React.FC<Props> = ({ pdfData, setPdfData, getFonts }) => {
    const [fonts, setFonts] = useState<Fonts[]>([]);

    useEffect(() => {
        if (!getFonts) return;
        const getFontData = async () => {
            let data = [];
            data = await Object.keys(getFonts).reduce((acc: Fonts[], curr) => {
                acc.push({ name: curr, fontTypes: getFonts[curr] })
                return acc;
            }, [])
            setFonts(data);
        }
        getFontData();
    }, [])

    const updatePDFData = (value: string | number | boolean, name: string) => {
        if (name === "orderDefault" || name === "stickerDefault") {
            // Since select cannot return boolean values we need to change the text to a boolean in here....
            if (value === "true") {
                value = true;
            } else if (value === "false") {
                value = false;
            }
        }
        console.log(value)
        setPdfData((prevState: PDFData[]) => ({ ...prevState, [name]: value }))
    }

    const updateTextData = (_id: string, text: string, font: string, fontType: string, fontSize: number, xPosition: number, yPosition: number) => {
        let data = pdfData?.PDFText?.map((data) =>
            data._id === _id ? { ...data, text, font, fontType, fontSize, xPosition, yPosition } : data
        )
        setPdfData({ ...pdfData, PDFText: data });
    }

    const updateImageData = (_id: string, imageURL: string, height: number, width: number, xPosition: number, yPosition: number) => {
        let data = pdfData?.PDFImage?.map((data) =>
            data._id === _id ? { ...data, imageURL, height, width, xPosition, yPosition } : data
        )
        setPdfData({ ...pdfData, PDFImage: data });
    }

    const removeTextData = (_id: string) => {
        let data = pdfData?.PDFText.filter((data) => {
            return data._id !== _id;
        })
        setPdfData({ ...pdfData, PDFText: data })
        fetch('http://localhost:5000/pdftext/delete_pdf_text', {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYmJiMjdkMDFlOGQxZjZlMzVmNTFjYSIsImlhdCI6MTY3MzMzMDg3OSwiZXhwIjoxNjc5MzMwODc5fQ.MfhU7s4GCTnV3c6PRd6pSlOcdIBZtmBD_SzrEaFXbkc'
            },
            body: JSON.stringify({
                currentUserId: "63bbb27d01e8d1f6e35f51ca",
                PDFId: pdfData?._id,
                _id: _id
            })
        })
            .then((res) => res.json())
            .then((response) => console.log(response))
    }

    const removeImageData = (_id: string) => {
        let data = pdfData?.PDFImage.filter((data) => {
            return data._id !== _id;
        })
        setPdfData({ ...pdfData, PDFImage: data })
        fetch('http://localhost:5000/pdfimage/delete_pdf_image', {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYmJiMjdkMDFlOGQxZjZlMzVmNTFjYSIsImlhdCI6MTY3MzMzMDg3OSwiZXhwIjoxNjc5MzMwODc5fQ.MfhU7s4GCTnV3c6PRd6pSlOcdIBZtmBD_SzrEaFXbkc'
            },
            body: JSON.stringify({
                currentUserId: "63bbb27d01e8d1f6e35f51ca",
                PDFId: pdfData?._id,
                _id: _id
            })
        })
            .then((res) => res.json())
            .then((response) => console.log(response))

    }

    const addTextData = () => {
        if (!pdfData) return;
        setPdfData({ ...pdfData, PDFText: [...pdfData?.PDFText, { _id: Date.now(), text: "", font: "helvetica", fontType: "normal", fontSize: 10, xPosition: 0, yPosition: 0 }] })
    }

    const addImageData = () => {
        if (!pdfData) return;
        setPdfData({ ...pdfData, PDFImage: [...pdfData?.PDFImage, { _id: Date.now(), imageURL: "", height: 10, width: 10, xPosition: 0, yPosition: 0 }] })
    }

    const savePDF = async () => {
        if (pdfData === null) return;
        /*
            This will turn the array of objects to a object which we will be able to patch in a fetch request.
            Since there are arrays inside of the pdfData we need to also .map the pdfDatas arrays and do the same things for it as well. 
        */
        let patchableData = await Object.keys(pdfData).reduce((acc: Acc[], curr) => {
            if (curr !== "createdAt" && curr !== "updatedAt" && curr !== "data") {
                const keyValue: keyof PDFData = curr;
                if (curr === "PDFText" || curr === "PDFImage") {
                    let pdfTextData: PDFPropData[] = [];
                    let pdfImageData: PDFPropData[] = [];
                    pdfData[keyValue].map(async (item: PDFText | PDFImage) => {
                        let data = await Object.keys(item).reduce((accT: Acc[], curr) => {
                            if (curr !== "createdAt" && curr !== "updatedAt" && curr !== "_id") {
                                const keyValue: keyof PDFText | PDFImage = curr;
                                accT.push({ "propName": keyValue, "value": item[keyValue] });
                            }
                            return accT;
                        }, [])
                        if (keyValue === "PDFText") {
                            pdfTextData.push({ "_id": item._id, "data": data })
                        } else if (keyValue === "PDFImage") {
                            pdfImageData.push({ "_id": item._id, "data": data })
                        }
                    })
                    if (curr === "PDFText") {
                        acc.push({ "propName": "PDFText", "value": pdfTextData });
                    } else if (curr === "PDFImage") {
                        acc.push({ "propName": "PDFImage", "value": pdfImageData });
                    }

                } else {
                    acc.push({ "propName": keyValue, "value": pdfData[keyValue] });
                }
            }
            return acc;
        }, []);

        fetch('http://localhost:5000/pdf/edit_pdf?currentUserId=63bbb27d01e8d1f6e35f51ca&currentPDFId=' + pdfData._id, {
            method: "PATCH",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYmJiMjdkMDFlOGQxZjZlMzVmNTFjYSIsImlhdCI6MTY3MzMzMDg3OSwiZXhwIjoxNjc5MzMwODc5fQ.MfhU7s4GCTnV3c6PRd6pSlOcdIBZtmBD_SzrEaFXbkc'
            },
            body: JSON.stringify(patchableData)
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
            })
            .catch((err) => {
                console.log(err);
            });

    }

    return (
        <div>
            <div>
                <span>PDF Name</span>
                <input name="PDFName" defaultValue={pdfData?.PDFName} onChange={(e) => updatePDFData(e.target.value, e.target.name)}></input>
                <span>Width</span>
                <input type="number" name="width" defaultValue={pdfData?.width} onChange={(e) => updatePDFData(Number(e.target.value), e.target.name)}></input>
                <span>Height</span>
                <input type="number" name="height" defaultValue={pdfData?.height} onChange={(e) => updatePDFData(Number(e.target.value), e.target.name)}></input>
                <span>Landscape or portrait</span>
                <select defaultValue={pdfData?.pageLayout} name="pageLayout" onChange={(e) => updatePDFData(e.target.value, e.target.name)}>
                    <option>Portrait</option>
                    <option>Landscape</option>
                </select>
                <span>Default sticker?</span>
                <select value={pdfData?.stickerDefault.toString()} name="stickerDefault" onChange={(e) => updatePDFData(e.target.value, e.target.name)}>
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
                <span>Default order pdf?</span>
                <select value={pdfData?.orderDefault.toString()} name="orderDefault" onChange={(e) => updatePDFData(e.target.value, e.target.name)}>
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
            </div>
            <div >
                <div>
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>Text</Th>
                                <Th>Font</Th>
                                <Th>FontSize</Th>
                                <Th>FontType</Th>
                                <Th>xPosition</Th>
                                <Th>yPosition</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {pdfData?.PDFText.map((text) => {
                                return (
                                    <PDFTableTextData key={text._id} text={text} fonts={fonts} getFonts={getFonts} removeTextData={(_id: string) => removeTextData(_id)}
                                        updateTextData={(_id: string, text: string, font: string, fontType: string, fontSize: number, xPosition: number, yPosition: number) => updateTextData(_id, text, font, fontType, fontSize, xPosition, yPosition)} />
                                )
                            })}
                        </Tbody>
                    </Table>
                    <button onClick={() => addTextData()}>Add new text</button>
                </div>
                <div>
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>ImageURL</Th>
                                <Th>Height</Th>
                                <Th>Width</Th>
                                <Th>xPosition</Th>
                                <Th>yPosition</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {pdfData?.PDFImage.map((image) => {
                                return (
                                    <PDFTableImageData key={image._id} image={image} removeImageData={(_id: string) => removeImageData(_id)}
                                        updateImageData={(_id: string, imageURL: string, height: number, width: number, xPosition: number, yPosition: number) => updateImageData(_id, imageURL, height, width, xPosition, yPosition)} />
                                )
                            })}
                        </Tbody>
                    </Table>
                    <button onClick={() => addImageData()}>Add new image</button>
                </div>
            </div>
            <button onClick={() => savePDF()}>Save PDF</button>
        </div>
    )
}

export default PDFEditor