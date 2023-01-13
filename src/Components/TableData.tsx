import React, { useState, useEffect } from 'react'
import { Tr, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import './PDFStyles.css';
import { PDFText } from '../model';

interface Props {
    text: PDFText;
    update: Function;
}

interface TextArr {
    _id: string;
    text: string;
    Font: string;
    FontType: string;
    FontSize: number;
    XPosition: number;
    YPosition: number;
}

const TableData: React.FC<Props> = ({ text, update }) => {
    const [textData, setTextData] = useState<TextArr>({ _id: text._id, text: text.text, Font: text.font, FontType: text.fontType, FontSize: text.fontSize, XPosition: text.xPosition, YPosition: text.yPosition })

    useEffect(() => {
        if(textData._id === null) return;
        update(textData._id, textData.text, textData.Font, textData.FontType, textData.FontSize, textData.XPosition, textData.YPosition)
    }, [textData])

    const handleChange = (value: string | number, name: string) => {
        setTextData((prevState) => {
            return {
                ...prevState,
                [name]: value
            }
        })
    }

    return (
        <Tr>
            <Td><input name='text' value={textData.text} onChange={(e) => handleChange(e.target.value, e.target.name)}></input></Td>
            <Td><input name='Font' value={textData.Font} onChange={(e) => handleChange(e.target.value, e.target.name)}></input></Td>
            <Td><input name='FontSize' value={textData.FontSize} onChange={(e) => handleChange(e.target.value, e.target.name)}></input></Td>
            <Td><input name='FontType' value={textData.FontType} onChange={(e) => handleChange(e.target.value, e.target.name)}></input></Td>
            <Td><input name='XPosition' value={textData.XPosition} onChange={(e) => handleChange(e.target.value, e.target.name)}></input></Td>
            <Td><input name='YPosition' value={textData.YPosition} onChange={(e) => handleChange(e.target.value, e.target.name)}></input></Td>
        </Tr>
    )
}

export default TableData