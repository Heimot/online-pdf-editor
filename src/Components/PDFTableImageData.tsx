import React, { useState, useEffect } from 'react'
import { Tr, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import './PDFStyles.css';
import { PDFImage } from '../model';
import PDFImageTable from './PDFImageTable';

interface Props {
    image: PDFImage;
    removeImageData: (_id: string) => void;
    updateImageData: (_id: string, imageURL: string, height: number, width: number, xPosition: number, yPosition: number) => void;
}

interface ImageArr {
    _id: string;
    imageURL: string;
    height: number;
    width: number;
    xPosition: number;
    yPosition: number;
}

const PDFTableImageData: React.FC<Props> = ({ image, removeImageData, updateImageData }) => {
    const [imageData, setImageData] = useState<ImageArr>({ _id: image._id, imageURL: image.imageURL, height: image.height, width: image.width, xPosition: image.xPosition, yPosition: image.yPosition })
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        if (imageData._id === null) return;
        updateImageData(imageData._id, imageData.imageURL, imageData.height, imageData.width, imageData.xPosition, imageData.yPosition)
    }, [imageData])

    const handleChange = (value: string | number, name: string) => {
        setImageData((prevState) => {
            return {
                ...prevState,
                [name]: value
            }
        })
    }

    return (
        <Tr>
            <Td>
                    <button onClick={() => setIsOpen((prevState) => !prevState)}>Choose image</button>
                    <div style={{ fontSize: "12px"}}>{imageData._id}</div>
            </Td>
            <Td><input name='height' value={imageData.height} onChange={(e) => handleChange(e.target.value, e.target.name)}></input></Td>
            <Td><input name='width' value={imageData.width} onChange={(e) => handleChange(e.target.value, e.target.name)}></input></Td>
            <Td><input name='xPosition' value={imageData.xPosition} onChange={(e) => handleChange(e.target.value, e.target.name)}></input></Td>
            <Td>
                <input name='yPosition' value={imageData.yPosition} onChange={(e) => handleChange(e.target.value, e.target.name)}></input>
                <button onClick={() => removeImageData(imageData._id)}>x</button>
            </Td>
            <PDFImageTable isOpen={isOpen} setIsOpen={(value: boolean) => setIsOpen(value)} chooseImage={(value: string) => setImageData((prevState) => { return { ...prevState, imageURL: value } })} />
        </Tr>
    )
}

export default PDFTableImageData