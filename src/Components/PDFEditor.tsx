import React, { useEffect, useState } from 'react'
import { PDFData, PDFText, PDFImage } from '../model'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import './PDFStyles.css';
import TableData from './TableData';

interface Props {
    pdfData: PDFData | null;
    setPdfData: Function;
}

interface Acc {
    propName: string;
    value: any;
}

interface PDFPropData {
    _id: string;
    data: Acc[];
}

const PDFEditor: React.FC<Props> = ({ pdfData, setPdfData }) => {
    const updatePDFData = (value: string | number | boolean, name: string) => {
        if (name === "orderDefault" || name === "stickerDefault") {
            if (value === "true") {
                value = true;
            } else if (value === "false") {
                value = false;
            }
        }
        setPdfData((prevState: PDFData[]) => ({ ...prevState, [name]: value }))
    }

    const updateTextData = (_id: string, text: string, font: string, fontType: string, fontSize: string, xPosition: number, yPosition: number) => {
        let data = pdfData?.PDFText?.map((data) =>
            data._id === _id ? { ...data, text, font, fontType, fontSize, xPosition, yPosition } : data
        )
        setPdfData({ ...pdfData, PDFText: data });
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
            <div className='editor__tables'>
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
                                    <TableData key={text._id} text={text} update={(_id: string, text: string, font: string, fontType: string, fontSize: string, xPosition: number, yPosition: number) => updateTextData(_id, text, font, fontType, fontSize, xPosition, yPosition)} />
                                )
                            })}
                        </Tbody>
                    </Table>
                </div>
                <div>
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>Event</Th>
                                <Th>Date</Th>
                                <Th>Location</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td>Tablescon</Td>
                                <Td>9 April 2019</Td>
                                <Td>East Annex</Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </div>
            </div>
            <button onClick={() => savePDF()}>Save PDF</button>
        </div>
    )
}

export default PDFEditor